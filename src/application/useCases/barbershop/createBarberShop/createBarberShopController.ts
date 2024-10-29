import { Request, Response, NextFunction } from "express";
import { AddressPropsType } from "../../../../domain/valueObjects/Address/Address";
import { IController } from "../../../interfaces/IController";
import { CreateBarberShopUseCase } from "./createBarberShopUseCase";






export class CreateBarberShopController implements IController {

    constructor(
        private createBarberShopUseCase: CreateBarberShopUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { name, phone, managerId, contractExpirationDate } = req.body

            const address = req.body.address as AddressPropsType

            const contractExpirationDateObj = new Date(contractExpirationDate)

            if (
                !name ||
                !phone ||
                !managerId ||
                !contractExpirationDate ||
                !address
            ) throw new Error('Informar o nome, telefone, ID do gerênte, data de expiração, e o endereço do estabelecimento')

            if (
                !address.country ||
                !address.state ||
                !address.city ||
                !address.street ||
                !address.neighborhood ||
                !address.number ||
                !address.zipCode
            ) throw new Error('O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP')

            if (isNaN(address.number)) throw new Error('Número do endereço inválido')

            if (isNaN(contractExpirationDateObj.getTime())) throw new Error('Date de expiração de contrato inválida')


            await this.createBarberShopUseCase.execute({
                address: {
                    ...address,
                    number: Number(address.number)
                },
                contractExpirationDate: new Date(contractExpirationDate),
                managerId,
                name,
                phone,
            })

            res.send({
                message: 'Estabelecimento cadastrado com sucesso'
            })

        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}