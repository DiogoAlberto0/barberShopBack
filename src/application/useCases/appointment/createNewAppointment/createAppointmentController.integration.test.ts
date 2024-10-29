import { describe, it, expect, beforeAll } from "vitest";

import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { request } from "../../../../test/integration/supertestConfig";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validCustomer } from "../../../../test/validEntitiesFromTests/validCustomer";
import { validService } from "../../../../test/validEntitiesFromTests/validService";
import { testPrismaClient } from "../../../../test/integration/prisma";



import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";
import { createAnValidService } from "../../../../test/integration/createValidData/createAnValidService";
import { createAnValidCustomer } from "../../../../test/integration/createValidData/createAnValidCustomer";
import { verifyIfAppointmentExistsInDB } from "../../../../test/integration/createValidData/createAnValidAppointment";

function getNextDayOfWeek(date: Date, dayOfWeek: number) {
    const resultDate = new Date(date);
    const currentDay = resultDate.getDay();
    const daysUntilNext = (dayOfWeek + 7 - currentDay) % 7;
    resultDate.setDate(resultDate.getDate() + daysUntilNext);
    return resultDate;

}

const validDate = getNextDayOfWeek(new Date(), 1)

const invalidBarberDate = getNextDayOfWeek(new Date(), 6)

const invalidBarberShopDate = getNextDayOfWeek(new Date(), 0)

const customerData = {
    customerName: validCustomer.name,
    customerCPF: validCustomer.cpf.cleaned,
    customerPhone: validCustomer.phone.phoneNumber
}

const serviceData = {
    barberShopId: validBarberShop.id,
    barberId: validBarber.id,
    serviceId: validService.id
}

describe('create appointment controller tests', () => {

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()
        await createAnValidService()
        await createAnValidCustomer()
    })

    it('should be possible to create a new appointment', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 18,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Agendamento criado com sucesso'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 18,
            startsAtMinute: 0
        })).toBeTruthy()
    })

    it('should be possible to create a new appointment at exact open time', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 8,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Agendamento criado com sucesso'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 8,
            startsAtMinute: 0
        })).toBeTruthy()
    })

    it('should throw error if dont have time to finish service', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 19,
                minute: 1,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Horário de término do agendamento ultrapassa o horário de trabalho do funcionário'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 19,
            startsAtMinute: 1
        })).toBeFalsy()
    })

    it('should return message "barber already have appoinmtent in that time"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 18,
                minute: 59,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'O funcionário já possui um agendamento neste horário'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 18,
            startsAtMinute: 59
        })).toBeFalsy()
    })

    it('should return message "barber unavaliable in this time"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 21,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Funcionário indisponivel neste horário'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 21,
            startsAtMinute: 0
        })).toBeFalsy()

    })

    it('should return message "barber unavaliable in this week day"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: invalidBarberDate,
                hour: 19,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Barberiro indisponivel neste dia da semana'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: invalidBarberDate,
            startsAtHour: 19,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "barber unavaliable in this date" if barber have an dayoff in this date', async () => {

        const date = getNextDayOfWeek(new Date(), 2)

        await testPrismaClient.dayOff.create({
            data: {
                date,
                userId: validBarber.id
            }
        })

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: date,
                hour: 19,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Funcionário indisponivel nesta data'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date,
            startsAtHour: 19,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "barber shop unavaliable in this date" if barber have an holiday in this date and is closed', async () => {

        const date = getNextDayOfWeek(new Date(), 3)

        await testPrismaClient.holiday.create({
            data: {
                date,
                barberShopId: validBarberShop.id,
                isClosed: true,
                openHour: 0,
                openMinute: 0,
                closeHour: 0,
                closeMinute: 0,
            }
        })

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: date,
                hour: 19,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento indisponivel nesta data'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date,
            startsAtHour: 19,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "barber shop unavaliable in this date" if barber have an holiday in this date and is not closed but is unavaliable in this time', async () => {

        const date = getNextDayOfWeek(new Date(), 4)

        await testPrismaClient.holiday.create({
            data: {
                date,
                barberShopId: validBarberShop.id,
                isClosed: false,
                openHour: 8,
                openMinute: 0,
                closeHour: 12,
                closeMinute: 0,
            }
        })

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date,
                hour: 13,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento indisponivel neste horário'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date,
            startsAtHour: 13,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should be possible to create appointment if barber have an holiday in this date and is not closed and is avaliable in this time', async () => {

        const date = getNextDayOfWeek(new Date(), 5)

        await testPrismaClient.holiday.create({
            data: {
                date,
                barberShopId: validBarberShop.id,
                isClosed: false,
                openHour: 8,
                openMinute: 0,
                closeHour: 12,
                closeMinute: 0,
            }
        })

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date,
                hour: 9,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Agendamento criado com sucesso'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date,
            startsAtHour: 9,
            startsAtMinute: 0
        })).toBeTruthy()
    })

    it('should return message "barber shop unavaliable in this week day"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: invalidBarberShopDate,
                hour: 20,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento indisponivel neste dia da semana'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: invalidBarberDate,
            startsAtHour: 20,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "barber shop unavaliable in this time"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 22,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento indisponivel neste horário'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 22,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "invalid CPF"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                customerName: validCustomer.name,
                customerCPF: '061.171.096.71',
                customerPhone: validCustomer.phone.phoneNumber,
                date: validDate,
                hour: 22,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'CPF inválido'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 22,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "invalid phone number"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                customerName: validCustomer.name,
                customerCPF: validCustomer.cpf.cleaned,
                customerPhone: '619999999',
                date: validDate,
                hour: 22,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })

        expect(await verifyIfAppointmentExistsInDB({
            customerId: validCustomer.id,
            ...serviceData,
            date: validDate,
            startsAtHour: 22,
            startsAtMinute: 0
        })).toBeFalsy()
    })

    it('should return message "invalid date"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: 'invalid date',
                hour: 15,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Data inválida'
        })

    })

    it('should return message "invalid hour"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 24,
                minute: 0,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'As horas devem estar entre 00 e 23'
        })

    })

    it('should return message "invalid minute"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 19,
                minute: 61,
                ...serviceData
            })

        expect(response.body).toStrictEqual({
            message: 'Os minutos devem estar entre 00 e 59'
        })

    })

    it('should return message "barber shop not found"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 19,
                minute: 0,
                barberShopId: '123',
                barberId: validBarber.id,
                serviceId: validService.id
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })

    })

    it('should return message "barber not found"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 19,
                minute: 0,
                barberShopId: validBarberShop.id,
                barberId: '123',
                serviceId: validService.id
            })

        expect(response.body).toStrictEqual({
            message: 'Funcionário não encontrado'
        })

    })

    it('should return message "service is not found"', async () => {

        const response = await request
            .post('/appointment/create')
            .send({
                ...customerData,
                date: validDate,
                hour: 19,
                minute: 0,
                barberShopId: validBarberShop.id,
                barberId: validBarber.id,
                serviceId: '123'
            })

        expect(response.body).toStrictEqual({
            message: 'Serviço não encontrado'
        })

    })

}) 