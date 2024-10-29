//entities
import { Barber } from "../../../../domain/Entities/Barber"

//value objects
import { Password } from "../../../../domain/valueObjects/Password/Password"
import { Phone } from "../../../../domain/valueObjects/Phone/Phone"

//contracts
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type updatePhoneAndPasswordInputDTO = {
    barberId: string,
    newPhone: string,
    newPassword: string
}

type updatePhoneAndPasswordOutputDTO = void

export class UpdatePhoneAndPasswordUseCase implements IUseCase<updatePhoneAndPasswordInputDTO, updatePhoneAndPasswordOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository
    ) { }

    async execute({
        barberId,
        newPhone,
        newPassword
    }: updatePhoneAndPasswordInputDTO): Promise<updatePhoneAndPasswordOutputDTO> {

        const newPhoneObj = new Phone(newPhone)

        const barber = await this.barberRepository.findById(barberId)
        if (!barber) throw new Error('Funcionário não encontrado')

        const isPhoneInUse = await this.barberRepository.isPhoneInUse(newPhoneObj)
        if (isPhoneInUse) throw new Error('Telefone já esta em uso')

        await this.barberRepository.update(Barber.with({
            id: barber.id,
            name: barber.name,
            phone: newPhoneObj,
            password: Password.create(newPassword),
            barberShop: barber.barberShop,
            cpf: barber.cpf,
            daysOff: barber.getDaysOff(),
            operation: barber.getOperation()
        }))

    }
}