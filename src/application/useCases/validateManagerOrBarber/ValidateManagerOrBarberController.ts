import { Request, Response, NextFunction } from "express";
import { IController } from "../../interfaces/IController";
import { ValidateManagerOrBarberUseCase } from "./validateManagerOrBarberUseCase";



export class ValidateManagerOrBarberController implements IController {

    constructor(
        private validateManagerOrBaberUseCase: ValidateManagerOrBarberUseCase
    ) { }


    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const authentication = req.headers.authorization
            if (!authentication) throw new Error('Usuário não autorizado')

            const token = authentication.split(' ')[1]
            if (!token) throw new Error('Usuário não autorizado')

            const { id } = await this.validateManagerOrBaberUseCase.execute({
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