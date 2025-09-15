export interface JwtPayload {
    userId: string; 
    device: string;
}

export type TokenWithClaims = JwtPayload & {
    iat?: number
    exp?: number
    bf?: number
}