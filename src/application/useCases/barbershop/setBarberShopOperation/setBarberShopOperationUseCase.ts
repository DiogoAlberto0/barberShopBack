
//value objects
import { Operation } from "../../../../domain/Entities/Operation"
import { Time } from "../../../../domain/valueObjects/Time/Time"
import { WeekDay } from "../../../../domain/valueObjects/WeekDay/WeekDay"

//contracts
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../IUseCase.interface"

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
type setOperationInputDTO = {
    managerId: string,
    barberShopId: string,
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

type setOperationOutputDTO = void

export class SetBarberShopOperationUseCase implements IUseCase<setOperationInputDTO, setOperationOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }
    async execute({ managerId, barberShopId, operation }: setOperationInputDTO): Promise<setOperationOutputDTO> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const barberShop = await this.barberShopRepository.findById(barberShopId)
        if (!barberShop) throw new Error('Estabelecimento não encontrado')

        if (barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        const operations = Object.entries(operation).map(([key, value]) => {

            const weekDay = new WeekDay(Number(key))
            const openTime = new Time({ hour: value?.open.hour || 0, minute: value?.open.minute || 0 })
            const closeTime = new Time({ hour: value?.close.hour || 0, minute: value?.close.minute || 0 })

            return new Operation(weekDay, openTime, closeTime)
        })


        barberShop.setOperationDays(operations)

        await this.barberShopRepository.update(barberShop)
    }
}