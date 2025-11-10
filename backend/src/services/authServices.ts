import { generateTokens, verifyAccessToken } from '../utils/jwtUtils';
import { isWithinSlidingWindowLog } from '../utils/cacheUtils';
import { isPhNum, isValidEmail, isValidPassword } from '../utils/validators';
import {
  createUser,
  getSellerById,
  getUserByEmailForLogin,
} from '../database/public.users/userQueries';
import bcrypt from 'bcrypt';
import db from '../../configs/dbConfig';
import logger from '../logger';
import { localCache } from '../localCache';
import { ImageDTO } from '../controllers/uploadController';
import supabase from '../../configs/supabaseConfig';
import { env } from '../../configs/env';

const RATE_LIMITS = {
  GLOBAL_LOGIN_LIMIT: 100,
  GLOBAL_REGISTER_LIMIT: 50,
  GLOBAL_SIGNED_URL_LIMIT: 30,
  GLOBAL_WINDOW: 60,
  SWL_IP_LIMIT: 20,
  SWL_DEVICE_LIMIT: 10,
  SWL_PHONE_NUM_LIMIT: 5,
  SWL_EMAIL_LIMIT: 5,
  SWL_WINDOW: 60,
  SWL_USER_LIMIT: 5,
} as const;

//authContext
export const authContext = (authHeader: string | undefined) => {
  const token = authHeader?.split(' ')[1];
  logger.info('Token: ', token);

  if (!token) {
    return {
      db,
      userId: null,
      deviceHash: null,
    };
  }

  const decodedToken = verifyAccessToken(token);
  logger.info(decodedToken.userId);
  return {
    db,
    userId: decodedToken.userId ?? null,
    deviceHash: decodedToken.deviceHash ?? null,
  };
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
      RATE_LIMITS.GLOBAL_WINDOW,
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
      RATE_LIMITS.GLOBAL_WINDOW,
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

export const signedUrl = async (
  ip: string,
  deviceHash: string,
  userId: string | null | undefined,
  images: ImageDTO[],
) => {
  const globalKey = `swl:uploadUrl:global`;
  const ipKey = `swl:uploadUrl:ip:${ip}`;
  const userKey = `swl:uploadUrl:email:${userId}`;
  const deviceKey = `swl:uploadUrl:device:${deviceHash}`;

  if (
    !isWithinSlidingWindowLog(
      userKey,
      RATE_LIMITS.SWL_USER_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  ) {
    throw new Error('RateLimitError');
  }
  if (
    !isWithinSlidingWindowLog(
      deviceKey,
      RATE_LIMITS.SWL_DEVICE_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  ) {
    throw new Error('RateLimitError');
  }
  if (
    !isWithinSlidingWindowLog(
      ipKey,
      RATE_LIMITS.SWL_IP_LIMIT,
      RATE_LIMITS.SWL_WINDOW,
    )
  ) {
    throw new Error('RateLimitError');
  }
  if (
    !isWithinSlidingWindowLog(
      globalKey,
      RATE_LIMITS.GLOBAL_SIGNED_URL_LIMIT,
      RATE_LIMITS.GLOBAL_SIGNED_URL_LIMIT,
    )
  ) {
    throw new Error('RateLimitError');
  }

  if (images.length === 0 || !userId) {
    throw new Error('InvalidCredentialsError');
  };
  
  const userExist = await getSellerById(userId)

  if (!userExist) {
    throw new Error('UserNotFound');
  }

  const allowed = ['image/jpeg', 'image/png'];
  const notValidImage = images.some((img) => !allowed.includes(img.mimeType));

  if (notValidImage) {
    throw new Error('InvalidCredentialsError');
  }

  const filePaths = images.map(
    (img) => `temp/${userId}/${Date.now()}_${img.fileName}`,
  );

  const uploadUrls = await Promise.all(
    filePaths.map(async (filePath) => {
      const { data, error } = await supabase.storage
        .from(env.supabaseBucket)
        .createSignedUploadUrl(filePath, { upsert: false });

      if (error || !data) {
        throw new Error('SupabaseStorageError');
      }

      return {
        signedUrl: data.signedUrl,
        filePath: data.path,
      };
    }),
  );

  return uploadUrls;
};
