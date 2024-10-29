import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { DeleteServiceUseCase } from "./deleteServiceUseCase";



export class DeleteServiceController implements IController {

    constructor(
        private deleteServiceUseCase: DeleteServiceUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const serviceId = req.params.serviceId as string
            if (!serviceId) throw new Error('Informe o id do serviço')


            await this.deleteServiceUseCase.execute({
                managerId,
                serviceId,
            })

            res.send({
                message: 'Serviço apagado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}