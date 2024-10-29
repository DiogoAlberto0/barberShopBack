import { Request, Response, NextFunction } from "express";
import { IController } from "../../../../interfaces/IController";
import { RemoveDayOffUseCase } from './removeDayOffUseCase'




export class RemoveDayOffController implements IController {

    constructor(
        private removeDayOffUseCase: RemoveDayOffUseCase
    ) { }

    private validateDay(day: any) {

        if (typeof day != 'number') return false
        if (day <= 0 || day >= 32) return false

        return true
    }

    private validateMonth(month: any) {

        if (typeof month != 'number') return false
        if (month <= 0 || month >= 13) return false

        return true
    }

    private validateYear(year: any) {

        if (typeof year != 'number') return false
        if (year <= 0) return false

        return true
    }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const barberId = req.body.barberId as string
            if (!barberId) throw new Error('Favor informar o id do funcionário')

            const { day, month, year } = req.body
            if (!this.validateDay(day) || !this.validateMonth(month) || !this.validateYear(year)) throw new Error('Informe o dia, mês e ano')

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            await this.removeDayOffUseCase.execute({
                barberId,
                date: new Date(year, month, day),
                managerId
            })

            res.send({
                message: 'Folga removida'
            })

        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}