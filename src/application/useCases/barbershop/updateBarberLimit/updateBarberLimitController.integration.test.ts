import { describe, it, expect, beforeAll } from 'vitest'
import { testPrismaClient } from '../../../../test/integration/prisma'
import { request } from '../../../../test/integration/supertestConfig'
import { validAdmin } from '../../../../test/validEntitiesFromTests/validAdmin'
import { validBarber2 } from '../../../../test/validEntitiesFromTests/validBarber'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests'
import { validManager } from '../../../../test/validEntitiesFromTests/validManager'



import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";

describe('update barber limit controller tests', () => {

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

    it('should be possible to update berber limit', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/barberLimit`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newLimit: 11
            })

        expect(response.body).toStrictEqual({
            message: 'Limite de funcionários atualizado com sucesso'
        })

        const { barberLimit } = await testPrismaClient.barberShop.findUniqueOrThrow({
            where: {
                id: validBarberShop.id
            },
            select: {
                barberLimit: true
            }
        })

        expect(barberLimit).toStrictEqual(11)
    })

    it('should return message "barber shop is not found"', async () => {

        const response = await request
            .put(`/barberShop/${123}/barberLimit`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newLimit: 11
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })
    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .put(`/barberShop/${123}/barberLimit`)
            .set('Authorization', `Bearer `)
            .send({
                newLimit: 11
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if invalid token is provided', async () => {

        const response = await request
            .put(`/barberShop/${123}/barberLimit`)
            .set('Authorization', `Bearer ey123`)
            .send({
                newLimit: 11
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if provided token is not from admin user', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .put(`/barberShop/${123}/barberLimit`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                newLimit: 11
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "invalid limit" if limit provided is a negetive number', async () => {

        const response = await request
            .put(`/barberShop/${123}/barberLimit`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newLimit: -1
            })

        expect(response.body).toStrictEqual({
            message: 'Favor informar um limite de funcionários válido'
        })
    })

    it('should return message "invalid limit" if limit provided is not a number', async () => {

        const response = await request
            .put(`/barberShop/${123}/barberLimit`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newLimit: 'dois'
            })

        expect(response.body).toStrictEqual({
            message: 'Favor informar um limite de funcionários válido'
        })
    })

    it('should return message "the limit not be less than active barber quantity"', async () => {

        await createAnValidBarber()

        await testPrismaClient.user.create({
            data: {
                id: validBarber2.id,
                name: validBarber2.name,
                cpf: validBarber2.cpf.cleaned,
                phone: validBarber2.phone.phoneNumber,
                hash: validBarber2.password.getHash(),
                role: 'barber',
                barberShop: {
                    connect: {
                        id: validBarberShop.id
                    }
                }
            }
        })

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/barberLimit`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newLimit: 1
            })

        expect(response.body).toStrictEqual({
            message: 'O novo limite é menor que a quantidade de funcionários existente'
        })
    })

    it('should be possible to update barber limit if the new limit is more than active barber limit', async () => {

        await testPrismaClient.user.update({
            where: {
                id: validBarber2.id
            },
            data: {
                isActive: false
            }
        })

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/barberLimit`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newLimit: 1
            })

        expect(response.body).toStrictEqual({
            message: 'Limite de funcionários atualizado com sucesso'
        })
    })
})