import { describe, it, expect, beforeAll } from "vitest";
import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { request } from "../../../../test/integration/supertestConfig";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { testPrismaClient } from "../../../../test/integration/prisma";

describe('create preference controller tests', () => {

    let managerToken: string

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

    it('should return preference id and payment url', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/incrementContractExpiration/checkout`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                monthsToIncrement: 1
            })

        expect(response.body).toStrictEqual({
            paymentUrl: expect.any(String),
            preferenceId: expect.any(String)
        })

        console.log(response.body)
        const preference = await testPrismaClient.preference.findFirst()

        expect(preference).toStrictEqual({
            id: expect.any(String),
            title: process.env.PRODUCT_NAME,
            barberShopId: validBarberShop.id,
            date: expect.any(Date),
            quantity: 1,
            price: Number(process.env.PRODUCT_PRICE),
            totalPrice: 30,
            status: 'PENDING'
        })

    })

    it('should return message "Unauthorized user" if invalid token is provided', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/incrementContractExpiration/checkout`)
            .set('Authorization', `Bearer ${123}`)
            .send({
                monthsToIncrement: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

        const preferences = await testPrismaClient.preference.findMany()

        expect(preferences).toHaveLength(1)

    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/incrementContractExpiration/checkout`)
            .set('Authorization', `Bearer`)
            .send({
                monthsToIncrement: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

        const preferences = await testPrismaClient.preference.findMany()

        expect(preferences).toHaveLength(1)

    })

    it('should return message "Unauthorized user" if the authenticated manager is not from barber shop', async () => {

        await createAnValidManager2()

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/incrementContractExpiration/checkout`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                monthsToIncrement: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

        const preferences = await testPrismaClient.preference.findMany()

        expect(preferences).toHaveLength(1)

    })

    it('should return message "barber shop is not found"', async () => {

        const response = await request
            .post(`/barberShop/${123}/incrementContractExpiration/checkout`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                monthsToIncrement: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })

        const preferences = await testPrismaClient.preference.findMany()

        expect(preferences).toHaveLength(1)

    })

    it('should return message "invalid monthsToIncrement quantity"', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/incrementContractExpiration/checkout`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                monthsToIncrement: 0
            })

        expect(response.body).toStrictEqual({
            message: 'A quantidade deve ser um número maior que 0'
        })

        const preferences = await testPrismaClient.preference.findMany()

        expect(preferences).toHaveLength(1)

    })
})