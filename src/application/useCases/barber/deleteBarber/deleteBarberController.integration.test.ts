import { describe, it, expect, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";

import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber, } from "../../../../test/integration/createValidData/createAnValidBarber";
describe('delete barber use case tests', () => {

    let managerToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should delete a valid and existing barber', async () => {

        const response = await request
            .delete(`/barber/delete/${validBarber.id}`)
            .set('Authorization', `Bearer ${managerToken}`)

        expect(response.body).toStrictEqual({
            message: 'Funcionário apagado com sucesso'
        })

        const barber = await testPrismaClient.user.findUnique({
            where: {
                id: validBarber.id
            }
        })

        expect(barber).not.toBeNull()
        expect(barber?.isActive).toBeFalsy()
    })

    it('should return message "Unauthorized user" if manager id is not provided', async () => {

        const response = await request
            .delete(`/barber/delete/${validBarber.id}`)
            .set('Authorization', `Bearer `)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if manager id is not provided', async () => {

        await createAnValidManager2()
        await testPrismaClient.user.update({
            where: {
                id: validBarber.id
            },
            data: {
                isActive: true
            }
        })

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const response = await request
            .delete(`/barber/delete/${validBarber.id}`)
            .set('Authorization', `Bearer ${manager2token}`)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "barber not found"', async () => {
        const response = await request
            .delete(`/barber/delete/123`)
            .set('Authorization', `Bearer ${managerToken}`)

        expect(response.body).toStrictEqual({
            message: 'Funcionário não encontrado'
        })
    })

})

