import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetAppointmentsByBarberShopUseCase } from "./getAppointmentsByBarberShopUseCase";

export class GetAppointmentsByBarberShopController implements IController {

    constructor(
        private getAppointmentsByBarberShopUseCase: GetAppointmentsByBarberShopUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autrizado')

            const barberShopId = req.query.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id da berbearia')

            const { page, pageSize } = this.getAndValidatePaginationQuery(req)

            const { date } = this.getAndValidateDateQuery(req)

            const appointments = await this.getAppointmentsByBarberShopUseCase.execute({
                managerId,
                barberShopId,
                date,
                page,
                pageSize,
            });

            res.status(200).send(appointments);
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            });
        }
    }

    private getAndValidatePaginationQuery = (req: Request) => {

        if (req.query.page && req.query.pageSize) {
            const page = Number(req.query.page);
            const pageSize = Number(req.query.pageSize);
            if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) throw new Error('Informe uma página e uma quantidade de registros por páginas válidos')

            return ({
                page,
                pageSize
            })
        } else {
            return ({
                page: undefined,
                pageSize: undefined
            })
        }

    }

    private getAndValidateDateQuery = (req: Request) => {
        if (req.query.date) {

            const date = new Date(req.query.date as string)
            if (isNaN(date.getDate())) throw new Error('Favor informar uma data válida')


            return ({
                date
            })
        } else {
            return ({
                date: undefined
            })
        }
    }
}
