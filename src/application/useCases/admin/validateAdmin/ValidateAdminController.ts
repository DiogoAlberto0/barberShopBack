import { NextFunction, Request, Response } from "express";
import { IController } from "../../../interfaces/IController";
import { ValidateAdminUseCase } from "./validateAdmin";



export class ValidateAdminController implements IController {

    constructor(
        private validateAdmin: ValidateAdminUseCase
    ) { }


    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const authentication = req.headers.authorization
            if (!authentication) throw new Error('Usuário não autorizado')

            const token = authentication.split(' ')[1]
            if (!token) throw new Error('Usuário não autorizado')

            const { id } = await this.validateAdmin.execute({
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