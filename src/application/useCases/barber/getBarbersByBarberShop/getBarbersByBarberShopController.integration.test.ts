import { describe, it, expect, beforeAll } from 'vitest'
import { testPrismaClient } from '../../../../test/integration/prisma'
import { request } from '../../../../test/integration/supertestConfig'
import { validBarber2 } from '../../../../test/validEntitiesFromTests/validBarber'
import { validBarberShop, validBarberShop2 } from '../../../../test/validEntitiesFromTests/validBarberShop'
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests'
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager'


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop, createAnValidBarberShop2 } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber, createAnValidBarber2 } from "../../../../test/integration/createValidData/createAnValidBarber";

describe('get barbers by barber shop controller tests', () => {


    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidManager2()
        await createAnValidBarberShop()
        await createAnValidBarberShop2()
        await createAnValidBarber()
        await testPrismaClient.user.create({
            data: {
                id: validBarber2.id,
                name: validBarber2.name,
                cpf: validBarber2.cpf.cleaned,
                phone: validBarber2.phone.phoneNumber,
                hash: validBarber2.password.getHash(),
                isActive: false,
                role: 'barber',
                barberShop: {
                    connect: {
                        id: validBarberShop.id
                    }
                }
            }
        })
    })

    it('should return all actives barbers if user is not authenticated', async () => {

        const response = await request
            .get(`/barber/all`)
            .query({ barberShopId: validBarberShop.id })

        expect(response.body.barbers).toHaveLength(1)
        expect(response.body.barbers[0]).toStrictEqual({
            id: expect.any(String),
            name: expect.any(String),
            phone: {
                countryCode: 55,
                phoneNumber: expect.any(String)
            },
            barberShop: expect.any(Object),
            operation: expect.any(Object),
            daysOff: expect.any(Object)
        })
    })

    it('should return all barbers if user is authenticated', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .get(`/barber/all`)
            .set('Authorization', `Bearer ${managerToken}`)
            .query({ barberShopId: validBarberShop.id })

        expect(response.body.barbers).toHaveLength(2)
    })

    it('should return all barbers if user is authenticated', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .get(`/barber/all`)
            .set('Authorization', `Bearer ${managerToken}`)
            .query({ barberShopId: validBarberShop2.id })

        expect(response.body.barbers).toHaveLength(0)
    })

    it('should return all barbers if user is authenticated', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .get(`/barber/all`)
            .set('Authorization', `Bearer ${managerToken}`)
            .query({ barberShopId: validBarberShop.id })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })
})
