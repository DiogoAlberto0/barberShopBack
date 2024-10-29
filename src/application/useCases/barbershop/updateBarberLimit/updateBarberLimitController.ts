import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { UpdateBarberLimitUseCase } from "./updateBerberLimitUseCase";




export class UpdateBarberLimitController implements IController {

    constructor(
        private updateBarberLimitUseCase: UpdateBarberLimitUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const newLimit = req.body.newLimit as number
            if (!newLimit || isNaN(newLimit) || newLimit < 0) throw new Error('Favor informar um limite de funcionários válido')

            const barberShopId = req.params.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id do estabelecimento')



            await this.updateBarberLimitUseCase.execute({
                barberShopId,
                newLimit: Number(newLimit)
            })

            res.send({
                message: 'Limite de funcionários atualizado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}