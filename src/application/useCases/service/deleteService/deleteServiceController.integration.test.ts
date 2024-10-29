import { describe, it, expect, beforeAll } from "vitest"
import { testPrismaClient } from "../../../../test/integration/prisma"
import { request } from "../../../../test/integration/supertestConfig"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager"
import { validService } from "../../../../test/validEntitiesFromTests/validService"


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidService } from "../../../../test/integration/createValidData/createAnValidService";

describe('delete service use case tests', () => {

    let managerToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidService()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should delete an valid service', async () => {

        const response = await request
            .delete(`/service/${validService.id}/delete`)
            .set('Authorization', `Bearer ${managerToken}`)


        expect(response.body).toStrictEqual({
            message: 'Serviço apagado com sucesso'
        })

        const service = await testPrismaClient.service.findUnique({
            where: {
                id: validService.id
            }
        })

        expect(service).toStrictEqual({
            id: validService.id,
            name: validService.name,
            description: validService.description,
            price: validService.price.getValue(),
            timeInMinutes: validService.timeInMinutes,
            isActive: false,
            barberShopId: validService.barberShopId
        })

    })

    it('should return message "Service not found" if a invalid service id is provided', async () => {

        const response = await request
            .delete(`/service/${123}/delete`)
            .set('Authorization', `Bearer ${managerToken}`)


        expect(response.body).toStrictEqual({
            message: 'Serviço não cadastrado'
        })

        const service = await testPrismaClient.service.findUnique({
            where: {
                id: validService.id
            }
        })

        expect(service).toStrictEqual({
            id: validService.id,
            name: validService.name,
            description: validService.description,
            price: validService.price.getValue(),
            timeInMinutes: validService.timeInMinutes,
            isActive: false,
            barberShopId: validService.barberShopId
        })
    })

    it('should return message "Unauthorized user" if token is not provided', async () => {
        const response = await request
            .delete(`/service/${validService.id}/delete`)
            .set('Authorization', `Bearer`)


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

        const service = await testPrismaClient.service.findUnique({
            where: {
                id: validService.id
            }
        })

        expect(service).toStrictEqual({
            id: validService.id,
            name: validService.name,
            description: validService.description,
            price: validService.price.getValue(),
            timeInMinutes: validService.timeInMinutes,
            isActive: false,
            barberShopId: validService.barberShopId
        })
    })

    it('should return message "Unauthorized user" if manager is not from the barber shop', async () => {

        // voltando servico para o estado inicial
        await testPrismaClient.service.update({
            where: {
                id: validService.id
            },
            data: {
                isActive: true
            }
        })

        // creating a new valid manager and authenticanting 
        await createAnValidManager2()
        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        // trying to delete an service with a invalid manager token
        const response = await request
            .delete(`/service/${validService.id}/delete`)
            .set('Authorization', `Bearer ${manager2token}`)


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

        // checking if service have changed
        const service = await testPrismaClient.service.findUnique({
            where: {
                id: validService.id
            }
        })

        expect(service).toStrictEqual({
            id: validService.id,
            name: validService.name,
            description: validService.description,
            price: validService.price.getValue(),
            timeInMinutes: validService.timeInMinutes,
            isActive: true,
            barberShopId: validService.barberShopId
        })
    })

})