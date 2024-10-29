import { describe, expect, it, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";

describe('remove holiday controller tests', () => {

    let managerToken: string

    const invalidDate = new Date()
    const date = new Date(invalidDate.getFullYear(), invalidDate.getMonth(), invalidDate.getDate())

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should be possible to remove an valid an existent holiday', async () => {

        await testPrismaClient.holiday.create({
            data: {
                id: '123',
                closeHour: 0,
                closeMinute: 0,
                date,
                isClosed: true,
                openHour: 0,
                openMinute: 0,
                barberShopId: validBarberShop.id
            }
        })

        const response = await request
            .delete(`/barberShop/${validBarberShop.id}/removeHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date: new Date()
            })

        expect(response.body).toStrictEqual({
            message: 'Feriado removido com sucesso'
        })

        const holiday = await testPrismaClient.holiday.findUnique({
            where: {
                id: '123'
            }
        })

        expect(holiday).toStrictEqual(null)
    })

    it('should return message "Holiday not found"', async () => {

        const response = await request
            .delete(`/barberShop/${validBarberShop.id}/removeHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date: new Date()
            })

        expect(response.body).toStrictEqual({
            message: 'Feriado não encontrado'
        })

    })

    it('should return message "Unauthorized user" if an invalid token is provided', async () => {

        const response = await request
            .delete(`/barberShop/${validBarberShop.id}/removeHoliday`)
            .set('Authorization', `Bearer ${123}`)
            .send({
                date: new Date()
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })


    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .delete(`/barberShop/${validBarberShop.id}/removeHoliday`)
            .set('Authorization', `Bearer`)
            .send({
                date: new Date()
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if provided token is from a manager is not from barber shop', async () => {

        await createAnValidManager2()

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const response = await request
            .delete(`/barberShop/${validBarberShop.id}/removeHoliday`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                date: new Date()
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "barber shop not found"', async () => {

        const response = await request
            .delete(`/barberShop/${123}/removeHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date: new Date()
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })

    })
})