import { describe, expect, it, beforeAll } from "vitest"
import { request } from "../../../../test/integration/supertestConfig"
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager"


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";


describe('update manager controller tests', () => {

    let token: string

    beforeAll(async () => {
        const { body } = await request
            .post('/admin/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        token = body.token

        await createAnValidManager()

    })

    it('should be possible to update manager', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999989',
            cpf: '22878734068',
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(200)
        expect(response.body).toStrictEqual({
            message: 'Gerente atualizado com sucesso'
        })

        const { body: { managers } } = await request
            .get('/manager/all')
            .set('Authorization', `Bearer ${token}`)

        expect(managers[0]).toStrictEqual({
            id: validManager.id,
            name: newManagerData.name.toLowerCase(),
            phone: {
                countryCode: 55,
                phoneNumber: newManagerData.phone
            },
            cpf: {
                cleaned: newManagerData.cpf
            },
            password: {
                hash: expect.any(String)
            },
            barberShops: []
        })
    })


    it('should return message "Unauthorized user" if token is not provided', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999996',
            cpf: '22878734068',
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if provided token is not from admin user', async () => {

        await createAnValidManager2()

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999996',
            cpf: '22878734068',
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "invalid phone number"', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '619999999',
            cpf: '22878734068',
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })
    })

    it('should return message "invalid cpf"', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999988',
            cpf: '22878734066',
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'CPF inválido'
        })
    })

    it('should return message "invalid password"', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999988',
            cpf: '693.458.230-69',
            password: '12345',
            confirmPassword: '12345'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'A senha deve conter no minimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial'
        })
    })

    it('should return message "invalid password"', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999988',
            cpf: '693.458.230-69',
            password: '1234567890Abc.',
            confirmPassword: '123456789Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'As senhas não coincidem'
        })
    })

    it('should return message "not found user" if an invalid id is provided', async () => {

        const newManagerData = {
            name: 'New Manager Name',
            phone: '61999999988',
            cpf: '693.458.230-69',
            password: '1234567890Abc.',
            confirmPassword: '1234567890Abc.'
        }
        const response = await request
            .put(`/manager/update/123`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não encontrado'
        })
    })

    it('should return message "name is already in use"', async () => {

        const newManagerData = {
            name: validManager2.name,
            phone: '61999999988',
            cpf: '693.458.230-69',
            password: '1234567890Abc.',
            confirmPassword: '1234567890Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Nome já cadastrado'
        })
    })

    it('should return message "phone number is already in use"', async () => {

        const newManagerData = {
            name: 'another new name',
            phone: validManager2.phone.phoneNumber,
            cpf: '693.458.230-69',
            password: '1234567890Abc.',
            confirmPassword: '1234567890Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Telefone já cadastrado'
        })
    })

    it('should return message "CPF is already in use"', async () => {

        const newManagerData = {
            name: 'another new name',
            phone: '61999999988',
            cpf: validManager2.cpf.cleaned,
            password: '1234567890Abc.',
            confirmPassword: '1234567890Abc.'
        }
        const response = await request
            .put(`/manager/update/${validManager.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newManagerData)

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'CPF já cadastrado'
        })
    })
})