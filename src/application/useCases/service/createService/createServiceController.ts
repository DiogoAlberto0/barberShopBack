import { Request, Response } from "express";
import { IController } from "../../../interfaces/IController";
import { CreateNewServiceUseCase } from "./createServiceUseCase";



export class CreateServiceController implements IController {

    constructor(
        private createServiceUseCase: CreateNewServiceUseCase
    ) { }
    handle = async (req: Request, res: Response) => {
        try {

            const { name, price, description, timeInMinutes } = req.body
            if (!name || !price || !description || !timeInMinutes) throw new Error('Informe o nome, preço, descrição e o tempo em minutos do serviço')
            if (typeof price != 'number') throw new Error('Preço inválido')
            if (typeof timeInMinutes != 'number') throw new Error('Tempo em minutos inválido')
            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const barberShopId = req.body.barberShopId as string
            if (!barberShopId) throw new Error('Informe a barbearia')


            await this.createServiceUseCase.execute({
                name,
                price,
                description,
                timeInMinutes,
                managerId,
                barberShopId,
            })

            res.send({
                message: 'Serviço cadastrado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}