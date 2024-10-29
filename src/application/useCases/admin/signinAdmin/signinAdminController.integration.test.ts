import { afterAll, beforeAll, describe, expect, it } from "vitest";


import { request } from '../../../../test/integration/supertestConfig'

import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";



describe('Signin Admin Controller Integration Tests', () => {
    it('should be possible to sign in', async () => {

        const response = await request
            .post('/admin/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            token: expect.any(String)
        })
    })

    it('should return a message "informing the phone number and password" if one of the two is not informed', async () => {
        const response = await request
            .post('/admin/signin')
            .send({
                phone: '',
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            message: 'Informe telefone e senha'
        })
    })

    it('should return a message "informing the phone number and password" if one of the two is not informed', async () => {
        const response = await request
            .post('/admin/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: ''
            })

        expect(response.body).toStrictEqual({
            message: 'Informe telefone e senha'
        })
    })

    it('should return a message "invalid phone number or password" if inexistent phone number is provided', async () => {
        const response = await request
            .post('/admin/signin')
            .send({
                phone: '61999999991',
                password: validPassword
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })
    })

    it('should return a message "invalid phone number or password" if a wrong password is provided', async () => {
        const response = await request
            .post('/admin/signin')
            .send({
                phone: '61999999991',
                password: '12345'
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone ou senha inválidos'
        })
    })
})