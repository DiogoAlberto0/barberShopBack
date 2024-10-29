import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { SetClosedStatusUseCase } from "./setClosedStatusUseCase";

export class SetClosedStatusController implements IController {

    constructor(
        private setClosedStatusUseCase: SetClosedStatusUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const appointmentId = req.params.appointmentId as string
            if (!appointmentId) throw new Error('Informe o id do agendamento')

            const userId = req.headers.id as string
            if (!userId) throw new Error('Usuário não autorizado')

            await this.setClosedStatusUseCase.execute({
                userId,
                appointmentId,
            })

            res.send({
                message: 'Agendamento concluido com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}