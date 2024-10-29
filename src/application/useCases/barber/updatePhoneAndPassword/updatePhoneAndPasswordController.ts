import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { UpdatePhoneAndPasswordUseCase } from "./updatePhoneAndPasswordUseCase";




export class UpdatePhoneAndPasswordController implements IController {

    constructor(
        private updatePhoneAndPasswordUseCase: UpdatePhoneAndPasswordUseCase
    ) { }


    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const barberId = req.headers.id as string
            if (!barberId) throw new Error('Usuário não autorizado')

            const { phone, password, confirmPassword } = req.body
            if (!phone || !password || !confirmPassword) throw new Error('Informe o telefone, a senha e a confirmação  da senha')

            if (password !== confirmPassword) throw new Error('As senhas não são iguais')

            await this.updatePhoneAndPasswordUseCase.execute({
                barberId,
                newPhone: phone,
                newPassword: password
            })

            res.send({
                message: 'Telefone e senha atualizados com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}