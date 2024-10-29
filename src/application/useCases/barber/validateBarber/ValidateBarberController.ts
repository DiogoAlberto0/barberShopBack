import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { ValidateBarberUseCase } from "./validateBarberUseCase";



export class ValidateBarberController implements IController {

    constructor(
        private validateBarber: ValidateBarberUseCase
    ) { }


    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const authentication = req.headers.authorization
            if (!authentication) throw new Error('Usuário não autorizado')

            const token = authentication.split(' ')[1]
            if (!token) throw new Error('Usuário não autorizado')

            const { id } = await this.validateBarber.execute({
                token
            })
            if (!id) throw new Error('Usuário não autorizado')

            req.headers.id = id
            next()
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}