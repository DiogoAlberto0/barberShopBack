import { Request, Response, NextFunction } from "express";
import { IController } from "../../../../interfaces/IController";
import { AddDayOffUseCase } from "./addDayOffUseCase";



export class AddDayOffController implements IController {

    constructor(
        private addDayOffUseCase: AddDayOffUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const barberId = req.body.barberId as string
            if (!barberId) throw new Error('Informe o id do funcionário')

            const { day, month, year } = req.body
            if (!day || !month || !year) throw new Error('Informe o dia, mês e ano')
            if (typeof day != 'number' || typeof month != 'number' || typeof year != 'number') throw new Error('Informe a data em formato numérico')

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            await this.addDayOffUseCase.execute({
                barberId,
                managerId,
                date: new Date(year, month, day)
            })

            res.send({
                message: 'Folga registrada'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}