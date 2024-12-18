import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import crypto from 'crypto'

export class ValidateMercadoPagoController implements IController {

    constructor(
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (process.env.ENVIRONMENT == 'TEST') {
                next()
                return
            }
            // Obtain the x-signature value from the header
            const xSignature = req.headers['x-signature'] as string; // Assuming headers is an object containing request headers
            const xRequestId = req.headers['x-request-id'] as string; // Assuming headers is an object containing request headers

            if (!xSignature || !xRequestId) throw new Error('Unauthorized')

            // Obtain Query params related to the request URL
            const dataID = req.query['data.id']
            if (!dataID) throw new Error('Unauthorized')

            // Separating the x-signature into parts
            const parts = xSignature.split(',');

            // Initializing variables to store ts and hash
            let ts;
            let hash;

            // Iterate over the values to obtain ts and v1
            parts.forEach(part => {
                // Split each part into key and value
                const [key, value] = part.split('=');
                if (key && value) {
                    const trimmedKey = key.trim();
                    const trimmedValue = value.trim();
                    if (trimmedKey === 'ts') {
                        ts = trimmedValue;
                    } else if (trimmedKey === 'v1') {
                        hash = trimmedValue;
                    }
                }
            });

            if (!ts || !hash) {
                throw new Error("Invalid x-signature format");
            }

            // Obtain the secret key for the user/application from Mercadopago developers site
            const secret = process.env.CLIENT_SECRET_KEY || '123';

            // Generate the manifest string
            const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

            // Create an HMAC signature
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(manifest);

            // Obtain the hash result as a hexadecimal string
            const sha = hmac.digest('hex');

            if (sha === hash) {
                // HMAC verification passed
                next()
            } else {
                // HMAC verification failed
                throw new Error("HMAC verification failed");
            }
        } catch (error: any) {
            res.status(401).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    };
}