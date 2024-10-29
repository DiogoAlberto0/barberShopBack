import { describe, it, expect, beforeAll } from 'vitest'
import { testPrismaClient } from '../../../../../test/integration/prisma'
import { request } from '../../../../../test/integration/supertestConfig'
import { validBarber } from '../../../../../test/validEntitiesFromTests/validBarber'
import { validPassword } from '../../../../../test/validEntitiesFromTests/validEntitiesFromTests'
import { validManager, validManager2 } from '../../../../../test/validEntitiesFromTests/validManager'


import { createAnValidManager, createAnValidManager2 } from "../../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../../test/integration/createValidData/createAnValidBarber";

describe('remove day off controller tests', () => {

    let managerToken: string
    const dayOffDate = new Date()

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()

        await testPrismaClient.dayOff.create({
            data: {
                date: dayOffDate,
                userId: validBarber.id
            }
        })

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token
    })

    it('should be possible to remove day off', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Folga removida'
        })

        const dayOffs = await testPrismaClient.dayOff.findMany({
            where: {
                userId: validBarber.id
            }
        })

        expect(dayOffs).toHaveLength(0)
    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer `)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if provided token is not from barber shop manager', async () => {

        await createAnValidManager2()

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "invalid barber id"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: '1345',
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Funcionário não encontrado'
        })
    })

    it('should return message "inform day"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: undefined,
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "inform month"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: undefined,
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "inform year"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: undefined
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "invalid day"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: 'segunda',
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "invalid month"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: 'dezembro',
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "invalid year"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: 'dois mil e vinte e quatro'
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o dia, mês e ano'
        })
    })

    it('should return message "day off not registered"', async () => {

        const response = await request
            .delete('/barber/removeDayOff')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                barberId: validBarber.id,
                day: dayOffDate.getDate(),
                month: dayOffDate.getMonth(),
                year: dayOffDate.getFullYear()
            })

        expect(response.body).toStrictEqual({
            message: 'Folga não cadastrada'
        })
    })




})
