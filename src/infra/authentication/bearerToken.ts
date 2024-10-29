import { IBearerToken } from "../../application/interfaces/authentication/bearerToken.interface";

import { sign, verify, decode } from 'jsonwebtoken'

type payload = {
    id: string;
    role: string;
}

export class BearerToken implements IBearerToken {
    async generateToken(payload: payload): Promise<{ token: string; }> {

        const token = sign(payload, process.env.JWT_SECRET || "123", {
            expiresIn: "7d"
        })

        return ({
            token
        })
    }
    async decodeToken(token: string): Promise<{ payload: payload; isValid: boolean; }> {

        const payload = decode(token) as payload
        const isValid = verify(token, process.env.JWT_SECRET || "123")

        return ({
            payload,
            isValid: isValid ? true : false
        })
    }

}