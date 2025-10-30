export interface JwtPayload {
    userId: string; 
    deviceHash: string
}

export type TokenWithClaims = JwtPayload & {
    iat?: number
    exp?: number
    bf?: number
}