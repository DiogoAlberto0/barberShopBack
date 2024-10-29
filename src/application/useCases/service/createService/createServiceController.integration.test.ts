import { describe, expect, it, beforeAll } from "vitest";
import {
    testPrismaClient
} from "../../../../test/integration/prisma";

import { request } from "../../../../test/integration/supertestConfig";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";
import { validService2 } from "../../../../test/validEntitiesFromTests/validService";



import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidInactiveService } from "../../../../test/integration/createValidData/createAnValidService";

describe('create service use case tests', () => {

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

    it('should recreate an extistent and inactive service', async () => {

        await createAnValidInactiveService()

        const newService = {
            name: validService2.name,
            description: 'lorem 2 ipsum 2',
            price: 50.50,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Serviço cadastrado com sucesso'
        })

        const service = await testPrismaClient.service.findFirst({
            where: {
                name: newService.name,
                description: newService.description
            }
        })

        expect(service).toStrictEqual({
            id: expect.any(String),
            name: newService.name,
            description: newService.description,
            price: newService.price,
            timeInMinutes: newService.timeInMinutes,
            isActive: true,
            barberShopId: validBarberShop.id,
        })
    })

    it('should create a service', async () => {

        const newService = {
            name: 'Test service',
            description: 'lorem ipsum dolor amiet',
            price: 50.50,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Serviço cadastrado com sucesso'
        })

        const service = await testPrismaClient.service.findFirst({
            where: {
                name: newService.name
            }
        })

        expect(service).toStrictEqual({
            id: expect.any(String),
            name: newService.name,
            description: newService.description,
            price: newService.price,
            timeInMinutes: newService.timeInMinutes,
            isActive: true,
            barberShopId: validBarberShop.id,
        })
    })

    it('should return message "barber shop not found"', async () => {
        const newService = {
            name: 'Test service',
            description: 'lorem ipsum dolor amiet',
            price: 50.50,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: 'validBarberShop.id'
            })


        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })
    })

    it('should return message "Service name is already in use"', async () => {
        const newService = {
            name: 'Test service',
            description: 'lorem ipsum dolor amiet',
            price: 50.50,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Serviço já cadastrado'
        })
    })

    it('should return message "Invalid price provided"', async () => {
        const newService = {
            name: 'Test service',
            description: 'lorem ipsum dolor amiet',
            price: 'asd',
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Preço inválido'
        })
    })

    it('should return message "Invalid time in minutes"', async () => {
        const newService = {
            name: 'Test service',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 'asd'
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Tempo em minutos inválido'
        })
    })

    it('should return message "expired contract, please contact the admin"', async () => {

        const now = new Date()
        const newContractExpiration = new Date()
        newContractExpiration.setDate(now.getDate() - 30)

        await testPrismaClient.barberShop.update({
            where: {
                id: validBarberShop.id
            },
            data: {
                contractExpiration: newContractExpiration
            }
        })

        const newService = {
            name: 'Another Test service',
            description: 'lorem ipsum dolor amiet',
            price: 40,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Seu contrato expirou, favor contatar o ADM'
        })
    })

    it('should return message "Unauthorized user" if invalid id is provided', async () => {

        const newService = {
            name: 'Another Test service',
            description: 'lorem ipsum dolor amiet',
            price: 40,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${1234}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if manager is not from barber shop', async () => {

        await createAnValidManager2()

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const newService = {
            name: 'Another Test service',
            description: 'lorem ipsum dolor amiet',
            price: 40,
            timeInMinutes: 30
        }

        const response = await request
            .post('/service/create')
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                ...newService,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })
})