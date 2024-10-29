import { describe, it, expect, beforeAll } from 'vitest';
import { testPrismaClient } from '../../../../test/integration/prisma';
import { request } from '../../../../test/integration/supertestConfig';
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests';
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager';
import { validService } from '../../../../test/validEntitiesFromTests/validService';


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidService } from "../../../../test/integration/createValidData/createAnValidService";

describe('UpdateServiceUseCase', () => {

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


    it('should return message "service not found"', async () => {

        const newData = {
            name: validService.name + 'updated',
            price: validService.price.getValue() + 10,
            description: validService.description + 'updated',
            timeInMinutes: validService.timeInMinutes + 10,
        }

        // update name service and verifying returned message
        const response = await request
            .put(`/service/${123}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: newData.name
            })

        expect(response.body).toStrictEqual({
            message: 'Serviço não cadastrado'
        })

    });

    it('should update only provided props', async () => {
        const newData = {
            name: validService.name + '1'
        }

        // update name service and verifying returned message
        const response = await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: newData.name
            })

        expect(response.body).toStrictEqual({
            message: 'Serviço atualizado com sucesso'
        })

        const service = await testPrismaClient.service.findUnique({
            where: {
                id: validService.id
            }
        })

        expect(service).toStrictEqual({
            id: validService.id,
            name: newData.name,
            price: validService.price.getValue(),
            description: validService.description,
            timeInMinutes: validService.timeInMinutes,
            isActive: true,
            barberShopId: validService.barberShopId
        })
    });

    it('should return message "service name is already in use"', async () => {
        const newData = {
            name: validService.name + '1'
        }

        // update name service and verifying returned message
        const response = await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: newData.name
            })

        expect(response.body).toStrictEqual({
            message: 'Serviço com o mesmo nome já cadastrado'
        })
    })

    it('should return message "Unauthorized user" if a invalid token is provided', async () => {
        const newData = {
            name: validService.name + '1'
        }

        // update name service and verifying returned message
        const response = await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${123}`)
            .send({
                name: newData.name
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

    it('should return message "Unauthorized user" if provided token is from manager from another barber shop', async () => {

        await createAnValidManager2()
        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })
        const newData = {
            name: validService.name + '1'
        }

        // update name service and verifying returned message
        const response = await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                name: newData.name
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

    it('should be possible to update an valid service', async () => {

        const newData = {
            name: validService.name + 'updated',
            price: validService.price.getValue() + 10,
            description: validService.description + 'updated',
            timeInMinutes: validService.timeInMinutes + 10,
        }

        // update name service and verifying returned message
        const response = await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: newData.name
            })

        expect(response.body).toStrictEqual({
            message: 'Serviço atualizado com sucesso'
        })

        // Updating other service properties, one at a time
        await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                price: newData.price
            })

        await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                description: newData.description
            })

        await request
            .put(`/service/${validService.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                timeInMinutes: newData.timeInMinutes
            })

        // verifying if props have changed

        const service = await testPrismaClient.service.findUnique({
            where: {
                id: validService.id
            }
        })

        expect(service).toStrictEqual({
            id: validService.id,
            name: newData.name,
            price: newData.price,
            description: newData.description,
            timeInMinutes: newData.timeInMinutes,
            isActive: true,
            barberShopId: validService.barberShopId
        })

    });
});
