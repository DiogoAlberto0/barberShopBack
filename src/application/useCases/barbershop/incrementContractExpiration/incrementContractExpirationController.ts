import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { IncrementContractExiprationUseCase } from "./incrementContractExpirationUseCase";



export class IncrementContractExpirationController implements IController {

    constructor(
        private incrementContractExpirationUseCase: IncrementContractExiprationUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const months = req.body.months as number
            if (!months || isNaN(months)) throw new Error('Informe uma quantidade de mêses válida para incrementar o contrato')

            const barberShopId = req.params.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id do estabelecimento')

            await this.incrementContractExpirationUseCase.execute({
                barberShopId,
                months: Number(months)
            })

            res.send({
                message: 'Data de expiração do contrado incrementada com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }


}