
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface";
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface";
import { IUseCase } from "../../IUseCase.interface";
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface";

interface IBarberSigninInputDTO {
    phone: string
    password: string
}

interface IBarberSigninOutputDTO {
    token: string
}

export class BarberSigninUseCase implements IUseCase<IBarberSigninInputDTO, IBarberSigninOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private bearerToken: IBearerToken,
        private barberShopRepository: IBarberShopRepository
    ) { }
    async execute(input: IBarberSigninInputDTO): Promise<IBarberSigninOutputDTO> {

        const phone = new Phone(input.phone)
        const password = input.password

        const user = await this.barberRepository.findByPhone(phone)
        if (!user) throw new Error('Telefone ou senha inválidos')

        const isCorrectPass = user.password.compare(password)
        if (!isCorrectPass) throw new Error('Telefone ou senha inválidos')

        const barberShop = await this.barberShopRepository.findById(user.barberShop.id)
        if (!barberShop) throw new Error('Estabelecimento não encontrado')


        const contractExpiration = barberShop.getContractExpirationDate()
        const invalidContractExpiration = new Date(barberShop.getContractExpirationDate())
        invalidContractExpiration.setMonth(contractExpiration.getMonth() + 1)
        if (invalidContractExpiration < new Date()) throw new Error('O contrato da sua barbearia expirou, favor contatar seu gerente')


        const { token } = await this.bearerToken.generateToken({ id: user.id, role: 'barber' })

        return ({
            token
        })
    }
}