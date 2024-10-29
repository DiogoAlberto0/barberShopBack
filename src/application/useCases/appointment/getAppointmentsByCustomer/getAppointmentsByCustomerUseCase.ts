import { Appointment } from "../../../../domain/Entities/Appointment"
import { Customer } from "../../../../domain/Entities/Customer"
import { CPF } from "../../../../domain/valueObjects/CPF/CPF"
import { Phone } from "../../../../domain/valueObjects/Phone/Phone"
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface"
import { IUseCase } from "../../IUseCase.interface"

type GetAppointmentsByCustomerInputDTO = {
    customerCPF: string
    customerPhone: string
    customerName: string
    page?: number
    pageSize?: number
    date?: Date
}

type GetAppointmentsByCustomerOutputDTO = {
    appointments: Appointment[]
    totalCount: number
}

export class GetAppointmentsByCustomerUseCase implements IUseCase<GetAppointmentsByCustomerInputDTO, GetAppointmentsByCustomerOutputDTO> {

    constructor(private appointmentRepository: IAppointmentRepository) { }

    async execute({ customerName, customerPhone, customerCPF, page, pageSize, date }: GetAppointmentsByCustomerInputDTO): Promise<GetAppointmentsByCustomerOutputDTO> {

        let skip: number | undefined = undefined
        let limit: number | undefined = undefined

        if (typeof page == 'number' && typeof pageSize == 'number') {
            skip = (page - 1) * pageSize
            limit = pageSize
        }

        const phone = new Phone(customerPhone)
        const cpf = new CPF(customerCPF)
        const customer = await this.appointmentRepository.findCustomer(customerName, phone, cpf)
        if (!customer) throw new Error('Cliente não encontrado')

        const appointments = await this.appointmentRepository.findByCustomer(customer, {
            skip,
            limit,
            date,
        })

        const totalCount = await this.appointmentRepository.countByCustomer(customer, date)

        return {
            appointments,
            totalCount,

        }
    }
}
