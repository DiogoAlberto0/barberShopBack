
import { Barber } from "../../../../domain/Entities/Barber"
import { CPF } from "../../../../domain/valueObjects/CPF/CPF"
import { Password } from "../../../../domain/valueObjects/Password/Password"
import { Phone } from "../../../../domain/valueObjects/Phone/Phone"
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type createBarberInputDTO = {
    name: string,
    phone: string,
    password: string,
    cpf: string,
    barberShopId: string,
    managerId: string
}

type createBarberOutputDTO = {
    barberId: string
}

export class CreateBarberUseCase implements IUseCase<createBarberInputDTO, createBarberOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({
        name,
        phone,
        cpf,
        password,
        barberShopId,
        managerId
    }: createBarberInputDTO): Promise<createBarberOutputDTO> {

        const phoneObj = new Phone(phone)
        const cpfObj = new CPF(cpf)
        const passwordObj = Password.create(password)

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não encontrado')

        const barberShop = await this.barberShopRepository.findById(barberShopId)
        if (!barberShop) throw new Error('Estabelecimento não encontrado')

        if (barberShop.getManagerId() !== manager.id) throw new Error('Usuário não autorizado')



        const barbersQuantity = await this.barberRepository.countBarbersFromBarberShop(barberShopId)
        if (barbersQuantity >= barberShop.getBarberLimit()) throw new Error('Quantidade de funcionários exedida')

        const barber = Barber.build({
            name,
            phone: phoneObj,
            password: passwordObj,
            cpf: cpfObj,
            barberShop
        })

        if (await this.barberRepository.isNameInUse(barber.name)) throw new Error('Nome já cadastrado')
        if (await this.barberRepository.isPhoneInUse(barber.phone)) throw new Error('Telefone já cadastrado')
        if (await this.barberRepository.isCPFInUse(barber.cpf)) throw new Error('CPF já cadastrado')

        const contractExpiration = barberShop.getContractExpirationDate()
        const invalidContractExpiration = new Date(barberShop.getContractExpirationDate())
        invalidContractExpiration.setMonth(contractExpiration.getMonth() + 1)
        if (invalidContractExpiration < new Date()) throw new Error('Seu contrato expirou favor contatar o admin')

        await this.barberRepository.create(barber)

        return ({
            barberId: barber.id
        })
    }
}