import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { UpdateManagerUseCase } from "./updateManagerUseCase";



export class UpdateManagerController implements IController {

    constructor(
        private updateManagerUseCase: UpdateManagerUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = req.params
            const { name, cpf, password, phone, confirmPassword } = req.body

            if (!id) throw new Error('Informar o gerente que deseja alterar')
            if (!name || !cpf || !phone) throw new Error('Informe o nome, cpf e telefone')
            if (password && password != confirmPassword) throw new Error('As senhas não coincidem')

            await this.updateManagerUseCase.execute({
                cpf,
                id,
                name,
                password,
                phone,
            })

            res.send({
                message: 'Gerente atualizado com sucesso'
            })

        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}