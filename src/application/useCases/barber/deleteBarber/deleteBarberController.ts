import { Request, Response, NextFunction } from "express";
import { DeleteBarberUseCase } from "./deleteBarberUseCase";
import { IController } from "../../../interfaces/IController";

export class DeleteBarberController implements IController {

    constructor(
        private deleteBarberUseCase: DeleteBarberUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const barberId = req.params.barberId
            if (!barberId) throw new Error('Informe o id do barberiro a ser excluido')


            await this.deleteBarberUseCase.execute({
                managerId,
                barberId
            })

            res.send({
                message: 'Funcionário apagado com sucesso'
            })


        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}