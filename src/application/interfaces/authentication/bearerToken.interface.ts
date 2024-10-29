
type payload = {
    id: string,
    role: string
}
export interface IBearerToken {
    generateToken(payload: payload): Promise<{ token: string }>;
    decodeToken(token: string): Promise<{ payload: payload, isValid: boolean }>
}