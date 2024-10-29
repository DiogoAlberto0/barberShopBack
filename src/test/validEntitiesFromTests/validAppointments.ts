import { Appointment } from "../../domain/Entities/Appointment";
import { Time } from "../../domain/valueObjects/Time/Time";
import { validBarber, validBarber2 } from "./validBarber";
import { validBarberShop, validBarberShop2 } from "./validBarberShop";
import { validCustomer } from "./validCustomer";
import { validService } from "./validService";


export const validAppointment = Appointment.build({
    barberId: validBarber.id,
    barberShopId: validBarberShop.id,
    customerId: validCustomer.id,
    date: new Date(),
    service: validService,
    startsAt: new Time({ hour: 8, minute: 0 })
})

export const validAppointment2 = Appointment.build({
    barberId: validBarber2.id,
    barberShopId: validBarberShop2.id,
    customerId: validCustomer.id,
    date: new Date(),
    service: validService,
    startsAt: new Time({ hour: 8, minute: 0 })
})

export const canceledValidAppointment = Appointment.with({
    id: '123',
    barberId: validBarber.id,
    barberShopId: validBarberShop.id,
    customerId: validCustomer.id,
    date: new Date(),
    service: validService,
    startsAt: new Time({ hour: 8, minute: 0 }),
    status: 'CANCELED'
})

export const closedValidAppointment = Appointment.with({
    id: '123',
    barberId: validBarber.id,
    barberShopId: validBarberShop.id,
    customerId: validCustomer.id,
    date: new Date(),
    service: validService,
    startsAt: new Time({ hour: 8, minute: 0 }),
    status: 'CLOSED'
})