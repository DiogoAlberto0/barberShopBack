import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { AddHolidayUseCase } from "./addHolidayUseCase";



export class AddHolidayController implements IController {

    constructor(
        private addHolidayUseCase: AddHolidayUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { date, isClosed, openTime, closeTime } = req.body
            if (!date) throw new Error('Informe a data do feriado')

            if (isClosed == undefined) throw new Error('Informe se o estabelecimento estará aberto ou fechado')

            if (isClosed == false && (!openTime || !closeTime)) throw new Error('Se o estabelecimento estiver aberto favor informar o horário de abertura e fechamento')

            if (openTime && (openTime.hour == undefined || openTime.minute == undefined)) throw new Error('Informe a hora e o minuto da abertura')
            if (closeTime && (closeTime.hour == undefined || closeTime.minute == undefined)) throw new Error('Informe a hora e o minuto do fechamento')

            const barberShopId = req.params.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id da berbearia')

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            await this.addHolidayUseCase.execute({
                date,
                isClosed,
                openTime,
                closeTime,
                managerId,
                barberShopId,
            })

            res.send({
                message: 'Feriado cadastrado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }


}