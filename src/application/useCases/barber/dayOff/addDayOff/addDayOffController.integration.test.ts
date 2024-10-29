import { describe, it, expect, beforeAll } from 'vitest'
import { testPrismaClient } from '../../../../../test/integration/prisma'
import { request } from '../../../../../test/integration/supertestConfig'
import { validBarber } from '../../../../../test/validEntitiesFromTests/validBarber'
import { validPassword } from '../../../../../test/validEntitiesFromTests/validEntitiesFromTests'
import { validManager, validManager2 } from '../../../../../test/validEntitiesFromTests/validManager'

import { createAnValidManager, createAnValidManager2 } from "../../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../../test/integration/createValidData/createAnValidBarber";
import { createAnValidAppointment } from '../../../../../test/integration/createValidData/createAnValidAppointment'
import { createAnValidService } from "../../../../../test/integration/createValidData/createAnValidService";
import { createAnValidCustomer } from "../../../../../test/integration/createValidData/createAnValidCustomer";

describe('add day off controller tests', () => {

    let managerToken: string
    const dayOffDate = new Date()
    dayOffDate.setMonth(new Date().getMonth() + 2)

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()
        await createAnValidService()
        await createAnValidCustomer()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token
    })

    it('should be possible to add day off', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getUTCMonth(),
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Folga registrada'
        })

        const dayOffs = await testPrismaClient.dayOff.findMany({
            where: {
                userId: validBarber.id
            }
        })

        expect(dayOffs).toHaveLength(1)
    })

    it('should return message "inform day"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: undefined,
                month: dayOffDate.getUTCMonth(),
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "inform month"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: undefined,
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "inform year"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getUTCMonth(),
                year: undefined
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "invalid day"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: 'dez',
                month: dayOffDate.getUTCMonth(),
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe a data em formato numérico'
        })
    })

    it('should return message "invalid month"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: 'dezembro',
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe a data em formato numérico'
        })
    })

    it('should return message "invalid year"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getUTCMonth(),
                year: 'dois mil e vinte e quatro'
            })

        expect(response.body).toStrictEqual({
            message: 'Informe a data em formato numérico'
        })
    })

    it('should return message "inform barber id"', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: undefined,
                day: dayOffDate.getDate(),
                month: dayOffDate.getUTCMonth(),
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Informe o id do funcionário'
        })
    })

    it('should return message "unauthorized user" if token is not provided', async () => {
        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer `)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getUTCMonth(),
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "unauthorized user" if provided token is not from barber shop manager', async () => {

        await createAnValidManager2()

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getUTCMonth(),
                year: dayOffDate.getUTCFullYear()
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "barber have appointments in this date"', async () => {

        const date = new Date()
        await createAnValidAppointment(date)

        const response = await request
            .post('/barber/addDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear()
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'O funcionário possui agendamentos nessa data'
        })
    })
})