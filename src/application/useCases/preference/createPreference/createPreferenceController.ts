import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { CreatePreferenceUseCase } from './createPreferenceUseCase';



export class CreatePreferenceController implements IController {

    constructor(
        private createPreferenceUseCase: CreatePreferenceUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autroizado')

            const barberShopId = req.params.barberShopId
            if (!barberShopId) throw new Error('Informe o ID do estabelecimento')

            const quantity = Number(req.body.monthsToIncrement)
            if (!quantity || isNaN(quantity) || quantity <= 0) throw new Error('A quantidade deve ser um número maior que 0')

            const { paymentUrl, preferenceId } = await this.createPreferenceUseCase.execute({
                barberShopId,
                managerId,
                quantity
            })

            res.send({
                paymentUrl,
                preferenceId
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    };
}