import jwt from 'jsonwebtoken';
import { JwtPayload, TokenWithClaims } from '../types/jwtTypes';
import { env } from '../../configs/env';
const JWT_ACCESS_TOKEN_SECRET = env.accessToken
const JWT_REFRESH_TOKEN_SECRET = env.refreshToken


//Access token
export function createAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET!, { expiresIn: '10m' })
}
export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET!) as JwtPayload
}

//Refresh token
export function createRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
}
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET!)  as JwtPayload
}

//some utility functions
export function stripPayloadClaims(payload: TokenWithClaims): JwtPayload {
    return {
      userId: payload.userId,
      deviceHash: payload.deviceHash,
    };
}

//helper
export const generateTokens = (userId: string, deviceHash: string) => {
    const payload = { userId, deviceHash };
    return {
        accessToken: createAccessToken(payload),
        refreshToken: createRefreshToken(payload)
    };
};