import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { DeleteAppointmentUseCase } from "./deleteAppointmentUseCase";




export class DeleteAppointmentController implements IController {

    constructor(
        private deleteAppointmentUseCase: DeleteAppointmentUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const appointmentId = req.params.appointmentId as string
            if (!appointmentId) throw new Error('Informe o agendamento a ser cancelado')

            const { customerName, customerPhone, customerCPF } = req.body
            if (!customerName || !customerPhone || !customerCPF) throw new Error('Informe o nome, o telefone e o CPF do cliente')


            await this.deleteAppointmentUseCase.execute({
                appointmentId,
                customerCPF,
                customerName,
                customerPhone,
            })

            res.send({
                message: 'Agendamento cancelado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}