import { describe, it, expect, beforeAll } from "vitest"

import { request } from "../../../../test/integration/supertestConfig"
import { testPrismaClient } from "../../../../test/integration/prisma"
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin"
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber"
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"


import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";
describe('signin barber controller tests', () => {

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()
    })

    it('should be possible to signin', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            token: expect.any(String)
        })

    })

    it('should return error message "inform phone number"', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: '',
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            message: 'Informe telefone e senha'
        })

    })

    it('should return error message "inform password"', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: ''
            })

        expect(response.body).toStrictEqual({
            message: 'Informe telefone e senha'
        })

    })

    it('should return error message "wrong phone number"', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: '619999999',
                password: '1234567890Abc.'
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })

    })
    it('should return error message "invalid user"', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: '61999999991',
                password: '1234567890Abc.'
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })

    })

    it('should return error message "wrong password"', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: '12345'
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })

    })

    it('should return error message "invalid phone or password" if the role user is not barber', async () => {

        const response = await request
            .post('/barber/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })

    })

    it('should return message "expired contract from your barber shop, contact your manager"', async () => {

        // setting the contract expiration date to before 30 days
        const now = new Date()

        const contractExpiration = new Date()
        contractExpiration.setDate(now.getDate() - 30)

        await testPrismaClient.barberShop.update({
            where: {
                id: validBarberShop.id
            },
            data: {
                contractExpiration
            }
        })

        // signin
        const response = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            message: 'O contrato da sua barbearia expirou, favor contatar seu gerente'
        })
    })
})