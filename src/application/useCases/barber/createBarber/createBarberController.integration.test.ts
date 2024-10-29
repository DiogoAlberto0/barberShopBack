
import { describe, it, expect, beforeAll } from 'vitest'
import { request } from '../../../../test/integration/supertestConfig'
import { testPrismaClient } from '../../../../test/integration/prisma'
import { validBarber, validBarber2 } from '../../../../test/validEntitiesFromTests/validBarber'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests'
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager'



import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
describe('create barber controller tests', () => {

    let managerToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()

        const response = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = response.body.token

    })

    it('should be possible to create a new barber', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Funcionário cadastrado'
        })
    })

    it('should return message "Unauthorized user" if manager is not from the barbershop', async () => {

        await createAnValidManager2()

        const { body: { token: managerToken2 } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })



        expect(managerToken2).not.toBeUndefined()

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken2}`)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer `)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "invalid phone number"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name,
                phone: '619999999',
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })
    })

    it('should return message "invalid cpf"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: '693.458.230-61',
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'CPF inválido'
        })
    })

    it('should return message "invalid password"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: '12345',
                confirmPassword: '12345',
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'A senha deve conter no minimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial'
        })
    })

    it('should return message "inform the same password"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword + '1',
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'As senhas não coincidem'
        })
    })

    it('should return message "barber shop not found"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name,
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: 'invalid barber shop id'
            })


        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })
    })

    it('should return message "barber name is already in use"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name.toUpperCase(),
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Nome já cadastrado'
        })
    })

    it('should return message "barber phone number is already in use"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name + '1',
                phone: validBarber.phone.phoneNumber,
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Telefone já cadastrado'
        })
    })

    it('should return message "barber cpf is already in use"', async () => {

        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber.name + '1',
                phone: '61999999989',
                cpf: validBarber.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'CPF já cadastrado'
        })
    })

    it('should return message "barber shop limit is ultrapassed"', async () => {

        await testPrismaClient.barberShop.update({
            where: {
                id: validBarberShop.id
            },
            data: {
                barberLimit: 1
            }
        })
        const response = await request
            .post('/barber/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarber2.name,
                phone: validBarber2.phone.phoneNumber,
                cpf: validBarber2.cpf.cleaned,
                password: validPassword,
                confirmPassword: validPassword,
                barberShopId: validBarberShop.id
            })


        expect(response.body).toStrictEqual({
            message: 'Quantidade de funcionários exedida'
        })
    })
})

