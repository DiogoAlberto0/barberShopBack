import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetAppointmentsByCustomerUseCase } from "./getAppointmentsByCustomerUseCase";

export class GetAppointmentsByCustomerController implements IController {

    constructor(
        private getAppointmentsByCustomerUseCase: GetAppointmentsByCustomerUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { customerCPF, customerName, customerPhone } = this.getAndValidateCustomerData(req)

            const { page, pageSize } = this.getAndValidatePaginationQuery(req)

            const { date } = this.getAndValidateDateQuery(req)



            const appointments = await this.getAppointmentsByCustomerUseCase.execute({
                customerCPF,
                customerName,
                customerPhone,
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

    private getAndValidateCustomerData = (req: Request) => {
        const { customerName, customerCPF, customerPhone } = req.body

        if (
            !customerName ||
            !customerCPF ||
            !customerPhone ||
            typeof customerName != 'string' ||
            typeof customerCPF != 'string' ||
            typeof customerPhone != 'string'
        ) throw new Error('Informe o nome, CPF e telefone válidos do cliente')

        return ({
            customerName,
            customerCPF,
            customerPhone
        })
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
