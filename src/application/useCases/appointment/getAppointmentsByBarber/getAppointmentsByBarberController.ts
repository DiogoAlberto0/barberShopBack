import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetAppointmentsByBarberUseCase } from "./getAppointmentsByBarberUseCase";

export class GetAppointmentsByBarberController implements IController {

    constructor(
        private getAppointmentsByBarberUseCase: GetAppointmentsByBarberUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const barberId = req.headers.id as string;
            if (!barberId) throw new Error('Usuário não autorizado');

            const { page, pageSize } = this.getAndValidatePaginationQuery(req)

            const { date } = this.getAndValidateDateQuery(req)

            const appointments = await this.getAppointmentsByBarberUseCase.execute({
                barberId,
                date,
                page,
                pageSize,
            });

            let response

            if (page && pageSize) {
                response = ({
                    ...appointments,
                    page,
                    pageSize
                })
            } else {
                response = appointments
            }

            res.status(200).send(response)
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
