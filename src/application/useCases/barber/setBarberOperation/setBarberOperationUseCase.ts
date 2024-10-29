import { Operation } from "../../../../domain/Entities/Operation";
import { Time } from "../../../../domain/valueObjects/Time/Time";
import { WeekDay } from "../../../../domain/valueObjects/WeekDay/WeekDay";
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

type operation = {
    open: {
        hour: number,
        minute: number
    },
    close: {
        hour: number,
        minute: number
    }
}

type setBarberOperationInputDTO = {
    managerId: string,
    barberId: string,
    operation: {
        0: operation | null,
        1: operation | null,
        2: operation | null,
        3: operation | null,
        4: operation | null,
        5: operation | null,
        6: operation | null
    }
}

type setBarberOperationOutputDTO = void

export class SetBarberOperationUseCase implements IUseCase<setBarberOperationInputDTO, setBarberOperationOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({ managerId, barberId, operation }: setBarberOperationInputDTO): Promise<setBarberOperationOutputDTO> {

        const barber = await this.barberRepository.findById(barberId)
        if (!barber) throw new Error('Funcionário não encontrado')

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')
        if (barber.barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        const operations = Object.entries(operation).map(([key, value]) => {

            const weekDay = new WeekDay(Number(key))
            const openTime = new Time({ hour: value?.open.hour || 0, minute: value?.open.minute || 0 })
            const closeTime = new Time({ hour: value?.close.hour || 0, minute: value?.close.minute || 0 })

            return new Operation(weekDay, openTime, closeTime)
        })


        barber.setOperationDays(operations)

        await this.barberRepository.update(barber)
    }

}