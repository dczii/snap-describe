export interface JwtPayload {
    userId: string; 
}

export type TokenWithClaims = JwtPayload & {
    iat?: number
    exp?: number
    bf?: number
}