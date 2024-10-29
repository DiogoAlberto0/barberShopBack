import { NextFunction, Request, Response } from 'express'
import { IController } from '../../../interfaces/IController'
import { SigninManagerUseCase } from './signinManagerUseCase'


export class SigninManagerController implements IController {

    constructor(
        private signinManagerUseCase: SigninManagerUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const phone = req.body.phone as string
            const password = req.body.password as string


            if (!phone || !password) throw new Error('Informe telefone e senha')

            const { token } = await this.signinManagerUseCase.execute({
                phone,
                password,
            })

            res.send({
                token
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro interno desconhecido'
            })
        }
    }
}