import { Request, Response, NextFunction } from "express";
import { Http2ServerRequest } from "http2";
import { IController } from "../../../interfaces/IController";
import { BarberSigninUseCase } from "./signinBarberUseCase";






export class BarberSigninController implements IController {

    constructor(
        private barberSigninUseCase: BarberSigninUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { phone, password } = req.body

            if (!phone || !password) throw new Error('Informe telefone e senha')


            const { token } = await this.barberSigninUseCase.execute({
                phone,
                password,
            })

            res.send({
                token
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }



}