import { generateTokens, verifyAccessToken } from '../utils/jwtUtils';
import { isWithinSlidingWindowLog } from '../utils/cacheUtils';
import { isPhNum, isValidEmail, isValidPassword } from '../utils/validators';
import {
  createUser,
  getUserByEmailForLogin,
} from '../data-access/users-db/users';
import bcrypt from 'bcrypt';
import db from '../lib/pgConn';
import logger from '../logger';
import { localCache } from '../localCache';

const RATE_LIMITS = {
  GLOBAL_LOGIN_LIMIT: 100,
  GLOBAL_LOGIN_WINDOW: 60,
  GLOBAL_REGISTER_LIMIT: 50,
  GLOBAL_REGISTER_WINDOW: 60,
  SWL_IP_LIMIT: 20,
  SWL_DEVICE_LIMIT: 10,
  SWL_PHONE_NUM_LIMIT: 5,
  SWL_EMAIL_LIMIT: 5,
  SWL_WINDOW: 60,
} as const;

//authContext for graphql
export const authContext = (authHeader: string) => {
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return {
      db,
    };
  }

  try {
    const decodedToken = verifyAccessToken(token);
    return {
      db,
      userId: decodedToken.userId ?? null,
      deviceHash: decodedToken.device ?? null,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      throw err;
    }

    //fallback
    throw err;
  }
};

//login for mobile
export const login = async (
  email: string,
  password: string,
  ip: string,
  deviceHash: string,
) => {
  const globalKey = `swl:login:global`;
  const ipKey = `swl:login:ip:${ip}`;
  const emailKey = `swl:login:email:${email}`;
  const deviceKey = `swl:login:device:${deviceHash}`;

  //check limits & clean windows
  if (
    !isWithinSlidingWindowLog(
      ipKey,
      RATE_LIMITS.SWL_IP_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  )
    throw new Error('RateLimitError');
  if (
    !isWithinSlidingWindowLog(
      deviceKey,
      RATE_LIMITS.SWL_DEVICE_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  )
    throw new Error('RateLimitError');
  if (
    !isWithinSlidingWindowLog(
      globalKey,
      RATE_LIMITS.GLOBAL_LOGIN_LIMIT,
      RATE_LIMITS.GLOBAL_LOGIN_WINDOW,
    )
  )
    throw new Error('RateLimitError');
  logger.info(Object.entries(localCache.getStats()));

  //validate client input
  if (!isValidEmail(email) || !isValidPassword(password))
    throw new Error('InvalidCredentialsError');

  //check if user Exist end compare password
  const user = await getUserByEmailForLogin(email);
  if (!user) throw new Error('InvalidCredentialsError');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('InvalidCredentialsError');

  //check limits & clean windows (for existing email only)
  if (
    !isWithinSlidingWindowLog(
      emailKey,
      RATE_LIMITS.SWL_EMAIL_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  )
    throw new Error('RateLimitError');

  //create and return tokens
  return generateTokens(user.id, deviceHash);
};

//registration for mobile
export const register = async (
  fullname: string,
  phoneNumber: string,
  email: string,
  password: string,
  ip: string,
  deviceHash: string,
) => {
  //keys
  const globalKey = `swl:register:global`;
  const ipKey = `swl:register:ip:${ip}`;
  const deviceKey = `swl:register:device:${deviceHash}`;
  const emailKey = `swl:register:email:${email}`;
  const phoneKey = `swl:register:phone:${phoneNumber}`;

  //check limits & clean windows for client credentials
  if (
    !isWithinSlidingWindowLog(
      ipKey,
      RATE_LIMITS.SWL_IP_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  )
    throw new Error('RateLimitError');
  if (
    !isWithinSlidingWindowLog(
      deviceKey,
      RATE_LIMITS.SWL_DEVICE_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  )
    throw new Error('RateLimitError');
  if (
    !isWithinSlidingWindowLog(
      globalKey,
      RATE_LIMITS.GLOBAL_REGISTER_LIMIT,
      RATE_LIMITS.GLOBAL_REGISTER_WINDOW,
    )
  )
    throw new Error('RateLimitError');

  //validate client input
  if (
    !isValidEmail(email) ||
    !isValidPassword(password) ||
    !isPhNum(phoneNumber)
  )
    throw new Error('InvalidCredentialsError');

  //no cp number checks for now
  const isUserExist = await getUserByEmailForLogin(email);
  if (isUserExist) throw new Error('AlreadyExist');

  //check limits & clean windows for email and phoneNumber
  if (
    !isWithinSlidingWindowLog(
      emailKey,
      RATE_LIMITS.SWL_EMAIL_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    ) ||
    !isWithinSlidingWindowLog(
      phoneKey,
      RATE_LIMITS.SWL_PHONE_NUM_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  )
    throw new Error('RateLimitError');

  //create new user and prepare tokens
  const newUser = await createUser(fullname, phoneNumber, email, password);
  if (!newUser) throw new Error('DatabaseError');

  //return tokens
  return generateTokens(newUser.id, deviceHash);
};
