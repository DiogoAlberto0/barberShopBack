
import { IBarberRepository } from "../../../../interfaces/repository/barberRepository.interface"
import { IManagerRepository } from "../../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../../IUseCase.interface"


type IRemoveDayOffInputDTO = {
    managerId: string,
    barberId: string,
    date: Date
}

type IRemoveDayOffOutputDTO = void

export class RemoveDayOffUseCase implements IUseCase<IRemoveDayOffInputDTO, IRemoveDayOffOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({ managerId, barberId, date }: IRemoveDayOffInputDTO): Promise<IRemoveDayOffOutputDTO> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const barberFromDb = await this.barberRepository.findById(barberId)
        if (!barberFromDb) throw new Error('Funcionário não encontrado')

        if (barberFromDb.barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        if (!await this.barberRepository.isRegisteredDayOff(barberId, date)) throw new Error('Folga não cadastrada')

        await this.barberRepository.removeDayOff(barberId, date)
    }
}