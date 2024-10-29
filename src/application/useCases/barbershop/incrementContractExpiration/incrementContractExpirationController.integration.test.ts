import { describe, expect, it, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager } from "../../../../test/validEntitiesFromTests/validManager";

import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";

describe('increment contract expiration controller tests', () => {

    let adminToken: string
    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()

        const { body } = await request
            .post('/admin/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        adminToken = body.token

        expect(adminToken).not.toBeUndefined()
    })

    it('should be possible to increment contract expiration', async () => {

        const oldContractExpirationDate = new Date(validBarberShop.getContractExpirationDate())
        const expectNewContractExpirationDate = new Date(oldContractExpirationDate)
        expectNewContractExpirationDate.setMonth(oldContractExpirationDate.getMonth() + 1)

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                months: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Data de expiração do contrado incrementada com sucesso'
        })

        const { contractExpiration } = await testPrismaClient.barberShop.findUniqueOrThrow({
            where: {
                id: validBarberShop.id
            },
            select: {
                contractExpiration: true
            }
        })

        expect(contractExpiration).toStrictEqual(expectNewContractExpirationDate)
    })


    it('should be possible to increment contract expiration', async () => {

        const oldContractExpirationDate = new Date(validBarberShop.getContractExpirationDate())
        const expectNewContractExpirationDate = new Date(oldContractExpirationDate)
        expectNewContractExpirationDate.setMonth(oldContractExpirationDate.getMonth() + 3)

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                months: '2'
            })

        expect(response.body).toStrictEqual({
            message: 'Data de expiração do contrado incrementada com sucesso'
        })

        const { contractExpiration } = await testPrismaClient.barberShop.findUniqueOrThrow({
            where: {
                id: validBarberShop.id
            },
            select: {
                contractExpiration: true
            }
        })

        expect(contractExpiration).toStrictEqual(expectNewContractExpirationDate)
    })


    it('should return message "invalid month for contract expiration"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                months: -1
            })

        expect(response.body).toStrictEqual({
            message: 'A quantidade de mêses deve ser um numero positivo'
        })

        const response2 = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                months: 'dois'
            })

        expect(response2.body).toStrictEqual({
            message: 'Informe uma quantidade de mêses válida para incrementar o contrato'
        })

    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer `)
            .send({
                months: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if provided token is not from admin', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                months: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if invalid token is provided', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${123}`)
            .send({
                months: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "barber shop not found" if invalid barber shop id is provided', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .put(`/barberShop/${123}/incrementContractExpiration`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                months: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })

    })
})