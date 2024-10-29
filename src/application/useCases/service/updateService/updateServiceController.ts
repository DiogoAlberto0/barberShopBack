import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { UpdateServiceUseCase } from "./updateServiceUseCase";



export class UpdateServiceController implements IController {

    constructor(
        private updateServiceUseCase: UpdateServiceUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { name, price, description, timeInMinutes } = req.body

            if (
                (price && typeof price != 'number') ||
                (timeInMinutes && typeof timeInMinutes != 'number')
            ) throw new Error('Preço ou tempo em minutos inválidos')

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const serviceId = req.params.serviceId as string
            if (!serviceId) throw new Error('Informe o id do serviço')


            await this.updateServiceUseCase.execute({
                name,
                price,
                description,
                timeInMinutes,
                managerId,
                serviceId,
            })

            res.send({
                message: 'Serviço atualizado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}