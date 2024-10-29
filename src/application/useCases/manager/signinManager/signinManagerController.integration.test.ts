import { describe, it, expect, beforeAll } from "vitest"

import { request } from "../../../../test/integration/supertestConfig"
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"
import { validManager } from "../../../../test/validEntitiesFromTests/validManager"


import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
describe('signin manager controller tests', () => {

    beforeAll(async () => {
        await createAnValidManager()
    })

    it('should be possible to signin', async () => {

        const response = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            token: expect.any(String)
        })

    })

    it('should return error message "inform phone number"', async () => {

        const response = await request
            .post('/manager/signin')
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
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: ''
            })

        expect(response.body).toStrictEqual({
            message: 'Informe telefone e senha'
        })

    })

    it('should return error message "wrong phone number"', async () => {

        const response = await request
            .post('/manager/signin')
            .send({
                phone: '61999999990',
                password: '1234567890Abc.'
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })

    })

    it('should return error message "wrong password"', async () => {

        const response = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: '12345'
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })

    })

    it('should return error message "invalid phone or password" if the role user is not manager', async () => {

        const response = await request
            .post('/manager/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })

    })
})