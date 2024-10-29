import { Request, Response, NextFunction } from "express";
import { AddressPropsType } from "../../../../domain/valueObjects/Address/Address";
import { IController } from "../../../interfaces/IController";
import { UpdateBarberShopUseCase } from "./updateBarberShopUseCase";




export class UpdateBarberShopController implements IController {

    constructor(
        private updateBarberShopUseCase: UpdateBarberShopUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { name, phone } = req.body

            const address = req.body.address as AddressPropsType

            const barberShopId = req.params.barberShopId as string

            const managerId = req.headers.id as string

            if (
                !name ||
                !phone ||
                !address
            ) throw new Error('Informar o nome, telefone, e o endereço do estabelecimento')

            if (
                !address.country ||
                !address.state ||
                !address.city ||
                !address.street ||
                !address.neighborhood ||
                !address.number ||
                !address.zipCode
            ) throw new Error('O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP')


            await this.updateBarberShopUseCase.execute({
                managerId,
                address,
                barberShopId,
                name,
                phone
            })

            res.send({
                message: 'Estabelecimento atualizado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}