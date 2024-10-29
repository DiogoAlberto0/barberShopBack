import { describe, it, expect, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validAddress } from "../../../../test/validEntitiesFromTests/validAddress";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validBarberShop, validBarberShop2 } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop, createAnValidBarberShop2 } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";

describe('update barber shop controller tests', () => {

    let managerToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidManager2()
        await createAnValidBarberShop2()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should be possible to update an valid barber shop', async () => {

        const newData = {
            name: 'new barber shop name test',
            phone: validManager.phone.phoneNumber,
            address: validAddress.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento atualizado com sucesso'
        })

        const barberShopFromDB = await testPrismaClient.barberShop.findUniqueOrThrow({
            where: {
                id: validBarberShop.id
            },
            select: {
                name: true,
                phone: true,
                address: true
            }
        })

        expect(barberShopFromDB.name).toStrictEqual(newData.name)
        expect(barberShopFromDB.phone).toStrictEqual(newData.phone)
        expect(barberShopFromDB.address).contain(newData.address)

        //reseting barber shop data
        const response2 = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarberShop.name,
                phone: validBarberShop.phone.phoneNumber,
                address: validBarberShop.address.props
            })

        expect(response2.body).toStrictEqual({
            message: 'Estabelecimento atualizado com sucesso'
        })
    })

    it('should return message "barber shop name is already in use" if barber shop name is already in use by another barber shop', async () => {

        const newData = {
            name: validBarberShop2.name,
            phone: validManager.phone.phoneNumber,
            address: validAddress.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Nome do estabelecimento já está em uso'
        })

    })

    it('should return message "barber shop phone is already in use" if barber shop phone is already in use by another barber shop', async () => {

        const newData = {
            name: 'new barber shop name test',
            phone: validBarberShop2.phone.phoneNumber,
            address: validAddress.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone do estabelecimento já está em uso'
        })

    })

    it('should return message "barber shop phone is already in use" if barber shop phone is already in use by another barber shop', async () => {

        const newData = {
            name: 'new barber shop name test',
            phone: validBarberShop2.phone.phoneNumber,
            address: validAddress.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone do estabelecimento já está em uso'
        })

    })

    it('should return message "barber shop address is already in use" if barber shop address is already in use by another barber shop', async () => {

        const newData = {
            name: 'new barber shop name test',
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop2.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Endereço já está em uso'
        })

    })

    it('should be possible to update barber shop with the same data', async () => {

        const newData = {
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento atualizado com sucesso'
        })

    })

    it('should return message "barber shop is not found"', async () => {

        const newData = {
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${123}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })

    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const newData = {
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer `)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if invalid token is provided', async () => {

        const newData = {
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${123}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if provided token is not from manager', async () => {

        await createAnValidBarber()

        const { body: { token: barberToken } } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: validPassword
            })

        expect(barberToken).not.toBeUndefined()

        const newData = {
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${barberToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if provided token is from a manager from another barber shop', async () => {

        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()

        const newData = {
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Invalid phone number"', async () => {

        const newData = {
            name: validBarberShop.name,
            phone: '619999999',
            address: validBarberShop.address.props
        }

        const response = await request
            .put(`/barberShop/update/${validBarberShop.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })

    })
})