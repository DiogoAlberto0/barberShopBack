import { describe, it, expect, beforeAll } from "vitest"


import { request } from "../../../../test/integration/supertestConfig"
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"
import { validManager } from "../../../../test/validEntitiesFromTests/validManager"



describe('create manager controler tests', () => {

    let token: string
    beforeAll(async () => {
        const response = await request
            .post('/admin/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        token = response.body.token
    })

    it('should be possible to create a new manager', async () => {


        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: validManager.name,
                phone: validManager.phone.phoneNumber,
                cpf: validManager.cpf.cleaned,
                password: validPassword
            })
        expect(response.status).toStrictEqual(201)
        expect(response.body).toStrictEqual({
            message: 'gerente criado com sucesso'
        })


        const { body: { managers } } = await request
            .get('/manager/all')
            .set('Authorization', `Bearer ${token}`)


        expect(managers[0]).toStrictEqual({
            id: expect.any(String),
            name: validManager.name.toLowerCase(),
            phone: { phoneNumber: validManager.phone.phoneNumber, countryCode: 55 },
            cpf: { cleaned: validManager.cpf.cleaned },
            password: { hash: expect.any(String) },
            barberShops: expect.any(Array)
        })
    })

    it('should return error message "unauthorized user"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer`)
            .send({
                name: 'manager test',
                phone: '61999999998',
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return error message "unauthorized user"', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: '61999999998',
                password: '1234567890Abc.'
            })

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: 'manager test',
                phone: '61999999998',
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return error message "inform name"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '',
                phone: '61999999998',
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Informe o nome, telefone, cpf e senha'
        })
    })

    it('should return error message "inform phone"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test',
                phone: '',
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Informe o nome, telefone, cpf e senha'
        })
    })

    it('should return error message "inform cpf"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test',
                phone: '61999999998',
                cpf: '',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Informe o nome, telefone, cpf e senha'
        })
    })

    it('should return error message "inform password"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test',
                phone: '61999999998',
                cpf: '863.882.860-89',
                password: ''
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Informe o nome, telefone, cpf e senha'
        })
    })

    it('should return error message "invalid phone number"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test',
                phone: '619999999',
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })
    })

    it('should return error message "invalid CPF"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test',
                phone: '61999999998',
                cpf: '863.882.860-90',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'CPF inválido'
        })
    })

    it('should return error message "name is already in use"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: validManager.name.toUpperCase(),
                phone: '61999999998',
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Nome já cadastrado'
        })
    })

    it('should return error message "phone number is already in use"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test2',
                phone: validManager.phone.phoneNumber,
                cpf: '863.882.860-89',
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Telefone já cadastrado'
        })
    })

    it('should return error message "cpf is already in use"', async () => {

        const response = await request
            .post('/manager/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Manager test2',
                phone: '61999999991',
                cpf: validManager.cpf.cleaned,
                password: '1234567890Abc.'
            })

        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'CPF já cadastrado'
        })
    })
})