import { Appointment } from "../../../../domain/Entities/Appointment"
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface"

type GetAppointmentsByBarberShopInputDTO = {
    managerId: string;
    barberShopId: string;
    page?: number;
    pageSize?: number;
    date?: Date;
}

type GetAppointmentsByBarberShopOutputDTO = {
    appointments: Appointment[]
    totalCount: number
}

export class GetAppointmentsByBarberShopUseCase implements IUseCase<GetAppointmentsByBarberShopInputDTO, GetAppointmentsByBarberShopOutputDTO> {

    constructor(
        private appointmentRepository: IAppointmentRepository,
        private managerRepository: IManagerRepository,
        private barberShopRepository: IBarberShopRepository
    ) { }

    async execute({ managerId, barberShopId, page, pageSize, date }: GetAppointmentsByBarberShopInputDTO): Promise<GetAppointmentsByBarberShopOutputDTO> {


        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const barberShop = await this.barberShopRepository.findById(barberShopId)
        if (!barberShop) throw new Error('Estabelecimento não encontrado')

        if (barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        let skip: number | undefined = undefined
        let limit: number | undefined = undefined

        if (typeof page == 'number' && typeof pageSize == 'number') {
            skip = (page - 1) * pageSize
            limit = pageSize
        }


        const appointments = await this.appointmentRepository.findByBarberShop(barberShopId, {
            skip,
            limit,
            date,
        })

        const totalCount = await this.appointmentRepository.countByBarberShop(barberShopId, date)

        return {
            appointments,
            totalCount,
        }
    }
}
