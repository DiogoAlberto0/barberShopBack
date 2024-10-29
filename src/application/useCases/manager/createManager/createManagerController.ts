import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { CreateManagerUseCase } from "./createManagerUseCase";



export class CreateManagerController implements IController {

    constructor(
        private createManagerUseCase: CreateManagerUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { name, cpf, password, phone } = req.body
            if (!name || !cpf || !password || !phone) throw new Error('Informe o nome, telefone, cpf e senha')

            await this.createManagerUseCase.execute({
                name,
                cpf,
                phone,
                password,
            })

            res.status(201).send({
                message: 'gerente criado com sucesso'
            })

        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}