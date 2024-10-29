
import { IBarberRepository } from "../../../../interfaces/repository/barberRepository.interface"
import { IManagerRepository } from "../../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../../IUseCase.interface"
import { IAppointmentRepository } from "../../../../interfaces/repository/appointmentRepository.interface"


type IAddDayOffInputDTO = {
    barberId: string,
    managerId: string
    date: Date
}

type IAddDayOffOutputDTO = void

export class AddDayOffUseCase implements IUseCase<IAddDayOffInputDTO, IAddDayOffOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository,
        private appointmentRepository: IAppointmentRepository
    ) { }

    async execute({ barberId, managerId, date }: IAddDayOffInputDTO): Promise<IAddDayOffOutputDTO> {


        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const barberFromDb = await this.barberRepository.findById(barberId)
        if (!barberFromDb) throw new Error('Funcionário não encontrado')

        if (manager.id != barberFromDb.barberShop.managerId) throw new Error('Usuário não autorizado')

        if (await this.barberRepository.isRegisteredDayOff(barberId, date)) throw new Error('Folga ja cadastrada')

        const isConflictingAppointment = await this.appointmentRepository.findByBarberAndDate(barberId, date)
        if (isConflictingAppointment.length > 0) throw new Error('O funcionário possui agendamentos nessa data')

        await this.barberRepository.addDayOff(barberId, date)
    }
}