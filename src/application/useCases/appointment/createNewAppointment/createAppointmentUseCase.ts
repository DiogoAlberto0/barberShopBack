//etities
import { BarberShop } from "../../../../domain/Entities/BarberShop"
import { Appointment } from "../../../../domain/Entities/Appointment"
import { Barber } from "../../../../domain/Entities/Barber"
import { Customer } from "../../../../domain/Entities/Customer"

//value objects
import { CPF } from "../../../../domain/valueObjects/CPF/CPF"
import { Phone } from "../../../../domain/valueObjects/Phone/Phone"
import { Time } from "../../../../domain/valueObjects/Time/Time"

//contracts
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface"
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IServiceRepository } from "../../../interfaces/repository/servicesRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type ICreateNewAppointmentInputDTO = {
    barberShopId: string,
    barberId: string,
    serviceId: string,

    customerName: string,
    customerCPF: string,
    customerPhone: string,

    date: Date,
    startsAt: {
        hour: number,
        minute: number
    },
}
type ICreateNewAppointmentOutputDTO = void

export class CreateNewAppointmentUseCase implements IUseCase<ICreateNewAppointmentInputDTO, ICreateNewAppointmentOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository,
        private barberRepository: IBarberRepository,
        private serviceRepository: IServiceRepository,
        private appointmentRepository: IAppointmentRepository
    ) { }

    async execute({
        barberShopId,
        barberId,
        serviceId,
        customerName,
        customerCPF,
        customerPhone,
        date,
        startsAt
    }: ICreateNewAppointmentInputDTO): Promise<ICreateNewAppointmentOutputDTO> {

        const barber = await this.validateBarber(barberId)
        const barberShop = await this.validateBarberShop(barberShopId)
        const service = await this.validateService(serviceId)
        const customer = await this.validateOrCreate(customerName, customerCPF, customerPhone)


        const newAppointment = Appointment.build({
            barberId: barber.id,
            barberShopId: barberShop.id,
            service,
            customerId: customer.id,
            date,
            startsAt: new Time(startsAt),
        })

        this.isBarberShopOnline(newAppointment, barberShop)
        this.isBarberOnline(newAppointment, barber)

        await this.checkForConflictAppointment(newAppointment, barber)

        await this.appointmentRepository.create(newAppointment)

    }


    private async validateBarber(barberId: string) {
        if (!barberId) throw new Error('Informe o ID do funcionário')

        const barberFromDb = await this.barberRepository.findById(barberId)
        if (!barberFromDb) throw new Error('Funcionário não encontrado')

        return barberFromDb
    }

    private isBarberOnline(newAppointment: Appointment, barber: Barber) {
        const operationDay = barber.getOperation().find(({ day: { day } }) => day == newAppointment.date.getDay())
        if (!operationDay) throw new Error('Funcionário indisponivel nesta data')

        if (
            operationDay.openTime.props.hour == 0 &&
            operationDay.openTime.props.minute == 0 &&
            operationDay.closeTime.props.hour == 0 &&
            operationDay.closeTime.props.minute == 0
        ) throw new Error('Barberiro indisponivel neste dia da semana')

        if (!this.isOverlapping(operationDay.openTime, operationDay.closeTime, newAppointment.startsAt, newAppointment.endsAt)) throw new Error('Funcionário indisponivel neste horário')

        const endTimeInMinutes = this.toMinutesSinceStartOfDay(newAppointment.endsAt)
        const barberCloseTimeInMinutes = this.toMinutesSinceStartOfDay(operationDay.closeTime)

        if (endTimeInMinutes > barberCloseTimeInMinutes) {
            throw new Error('Horário de término do agendamento ultrapassa o horário de trabalho do funcionário')
        }

        const dayOffs = barber.getDaysOff()

        const conflictingDayOFf = dayOffs.filter((dayOff) => dayOff.date.getDate() === newAppointment.date.getDate() && dayOff.date.getMonth() === newAppointment.date.getMonth() && dayOff.date.getFullYear() === newAppointment.date.getFullYear())

        if (conflictingDayOFf.length > 0) throw new Error('Funcionário indisponivel nesta data')
    }

    private isBarberShopOnline(newAppointment: Appointment, barberShop: BarberShop) {
        const operationDay = barberShop.getOperation().find(({ day: { day } }) => day == newAppointment.date.getDay())
        if (!operationDay) throw new Error('Estabelecimento indisponivel neste dia da semana')

        if (
            operationDay.openTime.props.hour == 0 &&
            operationDay.openTime.props.minute == 0 &&
            operationDay.closeTime.props.hour == 0 &&
            operationDay.closeTime.props.minute == 0
        ) throw new Error('Estabelecimento indisponivel neste dia da semana')

        if (!this.isOverlapping(operationDay.openTime, operationDay.closeTime, newAppointment.startsAt, newAppointment.endsAt)) throw new Error('Estabelecimento indisponivel neste horário')

        const endTimeInMinutes = this.toMinutesSinceStartOfDay(newAppointment.endsAt)
        const barberShopCloseTimeInMinutes = this.toMinutesSinceStartOfDay(operationDay.closeTime)

        if (endTimeInMinutes > barberShopCloseTimeInMinutes) {
            throw new Error('Horário de término do agendamento ultrapassa o horário de funcionamento do estabelecimento')
        }

        const holidays = barberShop.holidays

        const conflictingDayOFf = holidays.find((holiday) => holiday.props.date.getDate() === newAppointment.date.getDate() && holiday.props.date.getMonth() === newAppointment.date.getMonth() && holiday.props.date.getFullYear() === newAppointment.date.getFullYear())

        if (conflictingDayOFf && conflictingDayOFf.props.isClosed) throw new Error('Estabelecimento indisponivel nesta data')
        if (conflictingDayOFf && !this.isOverlapping(conflictingDayOFf.props.openTime, conflictingDayOFf.props.closeTime, newAppointment.startsAt, newAppointment.endsAt)) throw new Error('Estabelecimento indisponivel neste horário')




    }

    private async validateBarberShop(barberShopId: string) {
        if (!barberShopId) throw new Error('Informe o ID da barbearia')

        const barberShopFromDb = await this.barberShopRepository.findById(barberShopId)
        if (!barberShopFromDb) throw new Error('Estabelecimento não encontrado')

        const contractExpiration = barberShopFromDb.getContractExpirationDate()
        const invalidContractExpiration = new Date(barberShopFromDb.getContractExpirationDate())
        invalidContractExpiration.setMonth(contractExpiration.getMonth() + 1)
        if (invalidContractExpiration < new Date()) throw new Error('Barbearia indisponivel no momento, favor informar ao responsável')

        return barberShopFromDb
    }

    private async validateService(serviceId: string) {
        if (!serviceId) throw new Error('Informe o ID do serviço')

        const serviceFromDb = await this.serviceRepository.findById(serviceId)
        if (!serviceFromDb) throw new Error('Serviço não encontrado')

        return serviceFromDb
    }

    private async validateOrCreate(name: string, cpf: string, phone: string): Promise<Customer> {

        if (!name || !phone || !cpf) throw new Error('Favor informar o nome, telefone e CPF do cliente')

        const phoneObj = new Phone(phone)
        const cpfObj = new CPF(cpf)

        const customerFromDB = await this.appointmentRepository.findCustomer(name, phoneObj, cpfObj)

        if (customerFromDB) return customerFromDB

        return Customer.build({
            name,
            cpf: cpfObj,
            phone: phoneObj
        })
    }

    private async checkForConflictAppointment(newAppointment: Appointment, barber: Barber) {

        const conflictAppointments = await this.appointmentRepository.findByBarberAndDate(barber.id, newAppointment.date)

        conflictAppointments.forEach((existingAppointment) => {
            if (this.isOverlapping(existingAppointment.startsAt, existingAppointment.endsAt, newAppointment.startsAt, newAppointment.endsAt)) throw new Error('O funcionário já possui um agendamento neste horário')
        })
    }

    private isOverlapping(existentStartsTime: Time, existentsEndTime: Time, newStartsTime: Time, newEndTime: Time) {
        const newStartMinutes = this.toMinutesSinceStartOfDay(newStartsTime);
        const newEndMinutes = this.toMinutesSinceStartOfDay(newEndTime);

        const existingStartMinutes = this.toMinutesSinceStartOfDay(existentStartsTime);
        const existingEndMinutes = this.toMinutesSinceStartOfDay(existentsEndTime);

        return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes)
    }

    private toMinutesSinceStartOfDay(time: Time): number {
        return time.props.hour * 60 + time.props.minute;
    }

}


