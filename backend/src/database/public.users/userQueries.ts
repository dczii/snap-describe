import { localCache } from '../../localCache';
import db from '../../../configs/dbConfig';
import logger from '../../logger';
import bcrypt from 'bcrypt';
import USER_PREPARED_STATEMENTS from './userPreparedQueries';

//temporary type
interface UserDTO {
  id: string;
  password_hash: string;
}

interface CreateUserResult {
  id: string;
}

export async function getUserByEmailForLogin(
  email: string,
): Promise<UserDTO | null> {
  let user = localCache.get(email) as UserDTO | null;
  try {
    if (!user) {
      const { rows } = await db.query(USER_PREPARED_STATEMENTS.getUserByEmail, [
        email,
      ]);
      user = rows[0] || null;

      if (!user) return null;
      localCache.set(email, user);
    }
    return user;
  } catch (err) {
    //temporary error handler
    logger.error(err);
    return null;
  }
}

export async function getSellerById(id: string | null | undefined) {
  if (!id) {
    return null
  }

  logger.info('User Id: ', id)
  let user = localCache.get(id)
  try {
    if (!user) {
      const { rows } = await db.query(USER_PREPARED_STATEMENTS.getSellerById, [id])
      user = rows[0]
      if(!user) return null
      localCache.set(id, user)
    }
    logger.info('User info: ', user)
    return user
  } catch (err) {
    //simple error for now
    logger.error(err)
    return null;
  }
}

export async function createUser(
  fullname: string,
  phoneNumber: string,
  email: string,
  password: string,
) {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await db.query(USER_PREPARED_STATEMENTS.createUser, [
      fullname,
      phoneNumber,
      email,
      hashPassword,
    ]);

    const user: CreateUserResult | null = result.rows[0] ?? null;

    return user;
  } catch (err) {
    //temporary error handler
    logger.error('Database Error: ', err);
    throw new Error('DatabaseError');
  }
}
