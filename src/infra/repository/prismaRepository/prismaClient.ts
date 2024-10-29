//prisma
import { PrismaClient, Prisma } from "@prisma/client";

//entities
import { BarberShop } from "../../../domain/Entities/BarberShop";
import { Holiday } from "../../../domain/Entities/Holiday";
import { Operation } from "../../../domain/Entities/Operation";
import { Appointment } from "../../../domain/Entities/Appointment";
import { Customer } from "../../../domain/Entities/Customer";
import { Admin } from "../../../domain/Entities/Admin";
import { Barber } from "../../../domain/Entities/Barber";
import { DayOff } from "../../../domain/Entities/DayOff";
import { Manager } from "../../../domain/Entities/Manager";
import { Service } from "../../../domain/Entities/Service";

//value objects
import { Address } from "../../../domain/valueObjects/Address/Address";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";
import { Time } from "../../../domain/valueObjects/Time/Time";
import { WeekDay } from "../../../domain/valueObjects/WeekDay/WeekDay";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Password } from "../../../domain/valueObjects/Password/Password";
import { Price } from "../../../domain/valueObjects/Price/Price";
import { Preference } from "../../../domain/Entities/Preference";



export const prisma = new PrismaClient()

type IOperationDB = Prisma.OperationGetPayload<{}>;
export const convertOperationFromDBToEntity = (operationfromDB: IOperationDB): Operation => {
    const weekDay = new WeekDay(operationfromDB.weekDay)
    const openTime = new Time({ hour: operationfromDB.openHour, minute: operationfromDB.openMinute })
    const closeTime = new Time({ hour: operationfromDB.closeHour, minute: operationfromDB.closeMinute })

    return new Operation(weekDay, openTime, closeTime)
}

type IHolidayDB = Prisma.HolidayGetPayload<{}>;
export const convertHolidayFromDBToEntity = (holidayFromDb: IHolidayDB): Holiday => {
    const openTime = new Time({ hour: holidayFromDb.openHour, minute: holidayFromDb.openMinute })
    const closeTime = new Time({ hour: holidayFromDb.closeHour, minute: holidayFromDb.closeMinute })

    return new Holiday({
        closeTime,
        date: holidayFromDb.date,
        isClosed: holidayFromDb.isClosed,
        openTime
    })
}

type IAddressDB = Prisma.AddressGetPayload<{}>;
export const convertAddressFromDBToEntity = (addressFromDb: IAddressDB): Address => {
    return new Address({
        city: addressFromDb.city,
        country: addressFromDb.country,
        neighborhood: addressFromDb.neighborhood,
        number: addressFromDb.number,
        state: addressFromDb.state,
        street: addressFromDb.street,
        zipCode: addressFromDb.zipCode,
        complement: addressFromDb.complement || undefined
    })
}

type IBarberShopDB = Prisma.BarberShopGetPayload<{
    include: {
        address: true, holidays: true, operation: true
    }
}>;
export const convertBarberShopFromDBToEntity = (barberShopFromDB: IBarberShopDB): BarberShop => {

    const address = convertAddressFromDBToEntity(barberShopFromDB.address)

    const holidays = barberShopFromDB.holidays.map((holiday) => convertHolidayFromDBToEntity(holiday))

    const operation = barberShopFromDB.operation.map((op) => convertOperationFromDBToEntity(op))


    return BarberShop.with({
        id: barberShopFromDB.id,
        name: barberShopFromDB.name,
        phone: new Phone(barberShopFromDB.phone),
        managerId: barberShopFromDB.managerId,
        barberLimit: barberShopFromDB.barberLimit,
        contractExpirationDate: barberShopFromDB.contractExpiration,
        address,
        holidays,
        operation,
    })
}

type IBarberDB = Prisma.UserGetPayload<{
    include: {
        operation: true, dayOffs: true, barberShop: {
            include: {
                address: true, holidays: true, operation: true
            }
        }
    }
}>;
export const convertBarberFromDBToEntity = (userFromDB: IBarberDB, complete = true): Barber => {

    if (!userFromDB.barberShop || !userFromDB.operation) throw new Error('Funcionário invalido')

    const barberShop = convertBarberShopFromDBToEntity(userFromDB.barberShop)

    const operation = userFromDB.operation.map((op) => convertOperationFromDBToEntity(op))

    const daysOff = userFromDB.dayOffs.map((dayOff) => new DayOff(dayOff.date))

    return Barber.with({
        id: userFromDB.id,
        name: userFromDB.name,
        cpf: new CPF(userFromDB.cpf),
        phone: new Phone(userFromDB.phone),
        password: Password.withHash(userFromDB.hash),
        barberShop,
        daysOff,
        operation,
    })
}

type IManagerDB = Prisma.UserGetPayload<{
    include: {
        management: {
            include: {
                address: true,
                holidays: true,
                operation: true
            }
        }
    }
}>;
export const convertManagerFromDBToEntity = (userFromDB: IManagerDB) => {
    const barberShops = userFromDB.management.map((barberShop) => convertBarberShopFromDBToEntity(barberShop))

    return Manager.with({
        id: userFromDB.id,
        cpf: new CPF(userFromDB.cpf),
        name: userFromDB.name,
        password: Password.withHash(userFromDB.hash),
        phone: new Phone(userFromDB.phone),
        barberShops
    })
}

type IAdminDB = Prisma.UserGetPayload<{}>;
export const convertAdminFromDBToEntity = (userFromDB: IAdminDB) => {
    return Admin.with({
        id: userFromDB.id,
        cpf: new CPF(userFromDB.cpf),
        name: userFromDB.name,
        password: Password.withHash(userFromDB.hash),
        phone: new Phone(userFromDB.phone),
    })
}

type IServiceDB = Prisma.ServiceGetPayload<{}>;
export const convertServiceFromDBToEntity = (service: IServiceDB) => {
    return Service.with({
        id: service.id,
        name: service.name,
        description: service.description,
        price: new Price(service.price),
        timeInMinutes: service.timeInMinutes,
        barberShopId: service.barberShopId
    })
}

type ICustomerDB = Prisma.CustomerGetPayload<{}>;
export const convertCustomerFromDBToEntity = (customer: ICustomerDB) => {
    return Customer.with({
        id: customer.id,
        name: customer.name,
        phone: new Phone(customer.phone),
        cpf: new CPF(customer.cpf),
    })
}

type IAppointmentDB = Prisma.AppointmentGetPayload<{
    include: {
        service: true,
    }
}>;

export const convertAppointmentFromDBToEntity = (appointment: IAppointmentDB) => {
    if (
        appointment.status != 'CANCELED' &&
        appointment.status != 'OPENED' &&
        appointment.status != 'CLOSED'
    ) throw new Error('Status do agendamento inválido')

    return Appointment.with({
        id: appointment.id,
        status: appointment.status,
        date: appointment.date,
        startsAt: new Time({ hour: appointment.startsAtHour, minute: appointment.startsAtMinute }),
        barberId: appointment.barberId,
        service: convertServiceFromDBToEntity(appointment.service),
        barberShopId: appointment.barberShopId,
        customerId: appointment.customerId,
    })
}



type IPreferenceDB = Prisma.PreferenceGetPayload<{}>;
export const convertPreferenceFromDBToEntity = (preference: IPreferenceDB): Preference => {
    if (
        preference.status != 'CANCELED' &&
        preference.status != 'PENDING' &&
        preference.status != 'REJECTED' &&
        preference.status != 'APPROVED'
    ) throw new Error('Status do agendamento inválido')

    return Preference.with({
        id: preference.id,
        title: preference.title,
        barberShopId: preference.barberShopId,
        date: preference.date,
        price: preference.price,
        quantity: preference.quantity,
        status: preference.status,
    })
}
