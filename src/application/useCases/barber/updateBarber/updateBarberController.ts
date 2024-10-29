import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { UpdateBarberUseCase } from "./updateBarberUseCase";




export class UpdateBarberController implements IController {

    constructor(
        private updateBarberUseCase: UpdateBarberUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const barberId = req.params.barberId as string
            if (!barberId) throw new Error('Informe o id do funcionário')

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const { name, phone, cpf, newPassword, confirmNewPassword } = req.body

            if (newPassword && newPassword != confirmNewPassword) throw new Error('As senhas não coincidem')




            await this.updateBarberUseCase.execute({
                name,
                phone,
                cpf,
                barberId,
                managerId,
                newPassword,
            })

            res.send({
                message: 'Funcionário atualizado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}