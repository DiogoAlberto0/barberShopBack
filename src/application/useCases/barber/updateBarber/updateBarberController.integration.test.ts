// Test Framework
import { describe, it, expect, beforeAll } from 'vitest'
import { testPrismaClient } from '../../../../test/integration/prisma';
import { request } from '../../../../test/integration/supertestConfig';
import { validBarber } from '../../../../test/validEntitiesFromTests/validBarber';
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop';
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests';
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager';


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop, createAnValidBarberShop2 } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";
describe('UpdateBarberUseCase', () => {

    let managerToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidManager2()
        await createAnValidBarberShop2()
        await createAnValidBarber()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    });

    it('should possible to update the barber', async () => {

        const newData = {
            name: 'new name',
            phone: '61999999991',
            cpf: '76804123590',
            newPassword: validPassword,
            confirmNewPassword: validPassword
        }

        const response = await request
            .put(`/barber/${validBarber.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'Funcionário atualizado com sucesso'
        })

        const barber = await testPrismaClient.user.findUnique({
            where: {
                id: validBarber.id
            }
        })

        expect(barber).toStrictEqual({
            id: validBarber.id,
            name: newData.name,
            phone: newData.phone,
            cpf: newData.cpf,
            hash: expect.any(String),
            role: 'barber',
            isActive: true,
            barberShopId: validBarberShop.id
        })
    });

    it('should throw error if name is already in use', async () => {
        const newData = {
            name: validManager.name,
            barberShopId: validBarberShop.id,
        }

        const response = await request
            .put(`/barber/${validBarber.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'Nome já esta em uso'
        })
    });

    it('should throw error if phone is already in use', async () => {
        const newData = {
            phone: validManager.phone.phoneNumber,
            barberShopId: validBarberShop.id,
        }

        const response = await request
            .put(`/barber/${validBarber.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'Telefone já esta em uso'
        })
    });

    it('should throw error if CPF is already in use', async () => {
        const newData = {
            cpf: validManager.cpf.cleaned,
            barberShopId: validBarberShop.id,
        }

        const response = await request
            .put(`/barber/${validBarber.id}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'CPF já esta em uso'
        })
    });

    it('should throw an error if the barber is not found', async () => {
        const newData = {
            barberShopId: validBarberShop.id,
        }

        const response = await request
            .put(`/barber/${123}/update`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'Funcionário não encontrado'
        })
    });

    it('should return message "Unauthorized user" if token is not provided', async () => {
        const newData = {
            barberShopId: validBarberShop.id,
        }

        const response = await request
            .put(`/barber/${validBarber.id}/update`)
            .set('Authorization', `Bearer`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

    it('should return message "Unauthorized user" if token is provided token is from manager from another barber shop', async () => {

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const newData = {
            barberShopId: validBarberShop.id,
        }

        const response = await request
            .put(`/barber/${validBarber.id}/update`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                ...newData
            })


        expect(response.body).toStrictEqual({
            message: 'Gerente não autorizado'
        })
    });

});
