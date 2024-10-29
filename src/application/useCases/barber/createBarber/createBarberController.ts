import { Request, Response, NextFunction } from "express";
import { CreateBarberUseCase } from "./createBarberUseCase";
import { IController } from "../../../interfaces/IController";


export class CreateBarberController implements IController {

    constructor(
        private createBarberUseCase: CreateBarberUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const { name, phone, cpf, password, confirmPassword, barberShopId } = req.body
            if (!name || !phone || !cpf) throw new Error('Informe o nome, telefone e cpf do funcionário')
            if (!password || password != confirmPassword) throw new Error('As senhas não coincidem')
            if (!barberShopId) throw new Error('Favor informar o estabelecimento do funcionário')

            await this.createBarberUseCase.execute({
                barberShopId,
                cpf,
                managerId,
                name,
                password,
                phone
            })

            res.send({
                message: 'Funcionário cadastrado'
            })
        } catch (error: any) {

            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })

        }
    }

}