import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { CreateNewAppointmentUseCase } from "./createAppointmentUseCase";




export class CreateAppointmentController implements IController {

    constructor(
        private createAppointmentUseCase: CreateNewAppointmentUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { customerName, customerPhone, customerCPF } = req.body
            if (!customerName || !customerPhone || !customerCPF) throw new Error('Informe o nome, o telefone e o CPF do cliente')

            const dateString = req.body.date
            if (!dateString) throw new Error('Informe a data do agendamento')

            const date = new Date(dateString)
            if (isNaN(date.getTime())) throw new Error('Data inválida')

            const { hour, minute } = req.body
            if (isNaN(hour) || isNaN(minute)) throw new Error('Informe a hora e os minutos do agendamento')

            const barberShopId = req.body.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id da berbearia')

            const barberId = req.body.barberId as string
            if (!barberId) throw new Error('Informe o id do funcionário')

            const serviceId = req.body.serviceId as string
            if (!serviceId) throw new Error('Informe o id do serviço')



            await this.createAppointmentUseCase.execute({
                customerName,
                customerPhone,
                customerCPF,
                date,
                startsAt: {
                    hour,
                    minute
                },
                barberId,
                barberShopId,
                serviceId,
            })

            res.send({
                message: 'Agendamento criado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }


}