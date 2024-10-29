import { Barber } from "../../../../domain/Entities/Barber"
import { BarberShop } from "../../../../domain/Entities/BarberShop"
import { CPF } from "../../../../domain/valueObjects/CPF/CPF"
import { Password } from "../../../../domain/valueObjects/Password/Password"
import { Phone } from "../../../../domain/valueObjects/Phone/Phone"
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type UpdateBarberUseCaseInputDTO = {
    barberId: string,
    name?: string,
    phone?: string,
    cpf?: string,
    newPassword?: string,
    managerId: string
}

type UpdateBarberUseCaseOutputDTO = {
    updatedBarber: Barber
}

export class UpdateBarberUseCase implements IUseCase<UpdateBarberUseCaseInputDTO, UpdateBarberUseCaseOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({
        barberId,
        name,
        cpf,
        phone,
        managerId,
        newPassword
    }: UpdateBarberUseCaseInputDTO): Promise<UpdateBarberUseCaseOutputDTO> {

        const phoneObj = phone ? new Phone(phone) : undefined
        const cpfObj = cpf ? new CPF(cpf) : undefined

        const barber = await this.barberRepository.findById(barberId)
        if (!barber) throw new Error('Funcionário não encontrado')

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Gerente não encontrado')

        const barberShop = await this.barberShopRepository.findById(barber.barberShop.id)
        if (!barberShop) throw new Error('Estabelecimento não encontrado')

        const newBarberShop = await this.barberShopRepository.findById(barber.barberShop.id)
        if (!newBarberShop) throw new Error('Estabelecimento não encontrado')

        if (barberShop.getManagerId() !== manager.id) throw new Error('Gerente não autorizado')

        if (name && await this.barberRepository.isNameInUse(name)) throw new Error('Nome já esta em uso')
        if (phoneObj && await this.barberRepository.isPhoneInUse(phoneObj)) throw new Error('Telefone já esta em uso')
        if (cpfObj && await this.barberRepository.isCPFInUse(cpfObj)) throw new Error('CPF já esta em uso')

        const updatedBarber = Barber.with({
            id: barber.id,
            name: name || barber.name,
            phone: phoneObj ? phoneObj : barber.phone,
            password: newPassword ? Password.create(newPassword) : barber.password,
            barberShop,
            cpf: cpfObj ? cpfObj : barber.cpf,
            operation: barber.getOperation(),
            daysOff: barber.getDaysOff()
        })

        await this.barberRepository.update(updatedBarber)

        return ({
            updatedBarber
        })

    }
}