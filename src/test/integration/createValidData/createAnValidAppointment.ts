import { validAppointment, validAppointment2 } from "../../validEntitiesFromTests/validAppointments"
import { validBarber } from "../../validEntitiesFromTests/validBarber"
import { validBarberShop } from "../../validEntitiesFromTests/validBarberShop"
import { validCustomer } from "../../validEntitiesFromTests/validCustomer"
import { validService } from "../../validEntitiesFromTests/validService"
import { testPrismaClient } from "../prisma"

export const createAnValidAppointment = async (date: Date) => {

    await testPrismaClient.appointment.create({
        data: {
            id: validAppointment.id,
            date,
            startsAtHour: validAppointment.startsAt.props.hour,
            startsAtMinute: validAppointment.startsAt.props.minute,
            endsAtHour: validAppointment.endsAt.props.hour,
            endsAtMinute: validAppointment.endsAt.props.minute,
            status: 'OPENED',
            barberId: validAppointment.barberId,
            barberShopId: validAppointment.barberShopId,
            serviceId: validAppointment.service.id,
            customerId: validAppointment.customerId,
        }
    })
}

export const createAnValidAppointment2 = async (date: Date) => {

    await testPrismaClient.appointment.create({
        data: {
            id: validAppointment2.id,
            date,
            startsAtHour: validAppointment2.startsAt.props.hour,
            startsAtMinute: validAppointment2.startsAt.props.minute,
            endsAtHour: validAppointment2.endsAt.props.hour,
            endsAtMinute: validAppointment2.endsAt.props.minute,
            status: 'OPENED',
            barberId: validAppointment2.barberId,
            barberShopId: validAppointment2.barberShopId,
            serviceId: validAppointment2.service.id,
            customerId: validAppointment2.customerId,
        }
    })
}

export const createAnValidAppointments = async (quantity: number) => {


    const status = ['OPENED', 'CANCELED', 'CLOSED']

    for (let index = 1; index < quantity + 1; index++) {
        const date = new Date()
        date.setDate(date.getDate() + index)
        await testPrismaClient.appointment.create({
            data: {
                date,
                endsAtHour: 8,
                endsAtMinute: 0,
                startsAtHour: 9,
                startsAtMinute: 0,
                status: status[index % status.length],
                barberId: validBarber.id,
                barberShopId: validBarberShop.id,
                customerId: validCustomer.id,
                serviceId: validService.id
            }
        })
    }
}

export const verifyIfAppointmentExistsInDB = async (options: {
    customerId: string,
    barberShopId: string,
    barberId: string,
    serviceId: string,
    date: Date,
    startsAtHour: number,
    startsAtMinute: number
}) => {
    const appointment = await testPrismaClient.appointment.findMany({
        where: {
            ...options
        }
    })

    return appointment.length === 1
}