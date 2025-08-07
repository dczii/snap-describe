import jwt from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET


//Access token
export function createAccessToken(payload) {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
}
export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET!)
}

//Refresh token
export function createRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
}
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET!) 
}

//note: wala pang types for payload.