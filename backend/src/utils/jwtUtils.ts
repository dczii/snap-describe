import jwt from 'jsonwebtoken';
import { JwtPayload, TokenWithClaims } from '../types/jwtTypes';
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET


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
        device: payload.device
    }
}