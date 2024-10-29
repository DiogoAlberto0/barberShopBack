import { Appointment } from "../../../../domain/Entities/Appointment"
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface"
import { IUseCase } from "../../IUseCase.interface"
import { skip } from 'node:test';

type GetAppointmentsByBarberInputDTO = {
    barberId: string
    page?: number
    pageSize?: number
    date?: Date
}

type GetAppointmentsByBarberOutputDTO = {
    appointments: Appointment[]
    totalCount: number
}

export class GetAppointmentsByBarberUseCase implements IUseCase<GetAppointmentsByBarberInputDTO, GetAppointmentsByBarberOutputDTO> {
    constructor(private appointmentRepository: IAppointmentRepository) { }

    async execute({ barberId, page, pageSize, date }: GetAppointmentsByBarberInputDTO): Promise<GetAppointmentsByBarberOutputDTO> {

        let skip: number | undefined = undefined
        let limit: number | undefined = undefined

        if (typeof page == 'number' && typeof pageSize == 'number') {
            skip = (page - 1) * pageSize
            limit = pageSize
        }

        const appointments = await this.appointmentRepository.findByBarber(barberId, {
            date,
            limit,
            skip
        })

        const totalCount = await this.appointmentRepository.countByBarber(barberId, date)

        return {
            appointments,
            totalCount,
        }
    }
}

