import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { RemoveHolidayUseCase } from "./removeHolidayUseCase";



export class RemoveHolidayController implements IController {

    constructor(
        private removeHolidayUseCase: RemoveHolidayUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const barberShopId = req.params.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id da berbearia')

            const { date } = req.body
            if (!date) throw new Error('Informe a data do feriado a ser removido')
            const dateObj = new Date(date)
            if (isNaN(dateObj.getTime())) throw new Error('Informe uma date válida')

            await this.removeHolidayUseCase.execute({
                barberShopId,
                date: dateObj,
                managerId,
            })

            res.send({
                message: 'Feriado removido com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}