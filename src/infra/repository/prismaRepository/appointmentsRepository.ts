// contracts
import { IAppointmentRepository } from "../../../application/interfaces/repository/appointmentRepository.interface";

//entities
import { Appointment } from "../../../domain/Entities/Appointment";
import { Customer } from "../../../domain/Entities/Customer";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";

// prisma
import { convertAppointmentFromDBToEntity, convertCustomerFromDBToEntity, prisma } from "./prismaClient";


type findOptions = {
    skip?: number;
    limit?: number;
    date?: Date;
}

type findByProps = {
    options?: {
        skip: number,
        limit: number
    }
    barberId?: string,
    date?: Date,
    barberShopId?: string,
    customerId?: string,
    id?: string
}

export class PrismaAppointmentsRepository implements IAppointmentRepository {
    async findCustomerById(customerId: string): Promise<Customer | undefined> {

        const customer = await prisma.customer.findFirst({
            where: {
                id: customerId
            }
        })


        return customer ? convertCustomerFromDBToEntity(customer) : undefined
    }
    async findCustomer(name: string, phone: Phone, cpf: CPF): Promise<Customer | undefined> {

        const customer = await prisma.customer.findFirst({
            where: {
                name,
                cpf: cpf.cleaned,
                phone: phone.phoneNumber
            }
        })


        return customer ? convertCustomerFromDBToEntity(customer) : undefined
    }
    async create(appointment: Appointment): Promise<void> {
        await prisma.appointment.create({
            data: {
                id: appointment.id,
                status: appointment.status,
                date: appointment.date,
                endsAtHour: appointment.endsAt.props.hour,
                endsAtMinute: appointment.endsAt.props.hour,
                startsAtHour: appointment.startsAt.props.hour,
                startsAtMinute: appointment.startsAt.props.minute,
                barber: {
                    connect: {
                        id: appointment.barberId
                    }
                },
                barberShop: {
                    connect: {
                        id: appointment.barberShopId
                    }
                },
                service: {
                    connect: {
                        id: appointment.service.id
                    }
                },
                customer: {
                    connect: {
                        id: appointment.customerId
                    }
                }
            }
        })
    }

    private async findAppointmentBy({ id, date, barberId, barberShopId, customerId, options }: findByProps): Promise<Appointment[]> {

        let startDate: Date | undefined
        let endDate: Date | undefined

        if (date) {
            startDate = new Date(date)
            startDate.setHours(0)
            startDate.setMinutes(0)

            endDate = new Date(date)
            endDate.setHours(0)
            endDate.setMinutes(0)
            endDate.setDate(date.getDate() + 1)
        } else {
            startDate
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                id,
                barberShopId,
                barberId,
                customerId,
                date: {
                    gte: date ? startDate : undefined,
                    lt: date ? endDate : undefined
                }
            },
            orderBy: {
                date: 'asc'
            },
            include: {
                service: true,
            },
            take: options ? options.limit : undefined,
            skip: options ? options.skip : undefined
        })

        return appointments.map((appointment) => convertAppointmentFromDBToEntity(appointment))
    }

    private async countAppointmentBy({ id, date, barberId, barberShopId, customerId }: findByProps) {

        let startDate: Date | undefined
        let endDate: Date | undefined

        if (date) {
            startDate = new Date(date)
            startDate.setHours(0)
            startDate.setMinutes(0)

            endDate = new Date(date)
            endDate.setHours(0)
            endDate.setMinutes(0)
            endDate.setDate(date.getDate() + 1)
        } else {
            startDate
        }

        return await prisma.appointment.count({
            where: {
                id,
                date: {
                    gte: date ? startDate : undefined,
                    lt: date ? endDate : undefined
                },
                customerId,
                barberId,
                barberShopId
            }
        })
    }

    async findByBarberAndDate(barberId: string, date: Date): Promise<Appointment[]> {
        let startDate: Date
        let endDate: Date

        startDate = new Date(date)
        startDate.setHours(0)
        startDate.setMinutes(0)

        endDate = new Date(date)
        endDate.setDate(date.getDate() + 1)


        const appointments = await prisma.appointment.findMany({
            where: {
                barberId,
                date: {
                    gte: startDate,
                    lt: endDate
                }
            },
            include: {
                service: true,
            }
        })

        return appointments.map((appointment) => convertAppointmentFromDBToEntity(appointment))
    }

    async findByBarber(barberId: string, options?: findOptions): Promise<Appointment[]> {

        const limit = Number(options?.limit)
        const skip = Number(options?.skip)

        return await this.findAppointmentBy({
            barberId,
            date: options?.date,
            options: isNaN(limit) || isNaN(skip) ? undefined : {
                skip,
                limit
            }
        })

    }

    async countByBarber(barberId: string, date?: Date): Promise<number> {
        return await this.countAppointmentBy({ barberId, date })
    }

    async findByBarberShop(barberShopId: string, options?: findOptions): Promise<Appointment[]> {
        const limit = Number(options?.limit)
        const skip = Number(options?.skip)

        return await this.findAppointmentBy({
            barberShopId,
            date: options?.date,
            options: isNaN(limit) || isNaN(skip) ? undefined : {
                skip,
                limit
            }
        })
    }

    async countByBarberShop(barberShopId: string, date?: Date): Promise<number> {
        return await this.countAppointmentBy({ barberShopId, date })
    }

    async findByCustomer(customer: Customer, options?: findOptions): Promise<Appointment[]> {
        const limit = Number(options?.limit)
        const skip = Number(options?.skip)

        return await this.findAppointmentBy({
            customerId: customer.id,
            date: options?.date,
            options: isNaN(limit) || isNaN(skip) ? undefined : {
                skip,
                limit
            }
        })
    }

    async countByCustomer(customer: Customer, date?: Date): Promise<number> {
        return await this.countAppointmentBy({ customerId: customer.id, date })
    }

    async findById(appointmentId: string): Promise<Appointment | undefined> {
        const appointmnents = await this.findAppointmentBy({
            id: appointmentId
        })
        return appointmnents[0]
    }

    async update(appointment: Appointment): Promise<void> {
        await prisma.appointment.update({
            where: {
                id: appointment.id
            },
            data: {
                status: appointment.status,
                date: appointment.date,
                endsAtHour: appointment.endsAt.props.hour,
                endsAtMinute: appointment.endsAt.props.hour,
                startsAtHour: appointment.startsAt.props.hour,
                startsAtMinute: appointment.startsAt.props.minute,
                barberId: appointment.barberId,
                barberShopId: appointment.barberShopId,
                customerId: appointment.customerId,
                serviceId: appointment.service.id,
            }
        })
    }

}