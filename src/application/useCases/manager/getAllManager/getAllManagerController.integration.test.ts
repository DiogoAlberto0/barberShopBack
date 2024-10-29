import { describe, it, expect, beforeAll } from "vitest"

import { request } from "../../../../test/integration/supertestConfig"
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"
import { validManager } from "../../../../test/validEntitiesFromTests/validManager"


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
describe('get all managers controller use case', () => {

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

        await createAnValidManager2()
    })

    it('should return all managers if pagination parameters is not provided', async () => {

        const response = await request
            .get('/manager/all')
            .set('Authorization', `Bearer ${token}`)

        expect(response.body.managers.length).toStrictEqual(2)
        expect(response.body.total).toStrictEqual(2)
        expect(response.body.managers[0]).toStrictEqual({
            id: expect.any(String),
            name: expect.any(String),
            phone: {
                countryCode: expect.any(Number),
                phoneNumber: expect.any(String)
            },
            cpf: {
                cleaned: expect.any(String)
            },
            password: {
                hash: ''
            },
            barberShops: expect.any(Array)
        })

    })

    it('should return paginated managers if pagination parameters is provided', async () => {

        const response = await request
            .get('/manager/all')
            .set('Authorization', `Bearer ${token}`)
            .query({
                pageSize: 1,
                page: 1
            })

        expect(response.body.managers.length).toStrictEqual(1)
        expect(response.body.total).toStrictEqual(2)
        expect(response.body.page).toStrictEqual(1)
        expect(response.body.pageSize).toStrictEqual(1)
        expect(response.body.managers[0]).toStrictEqual({
            id: expect.any(String),
            name: expect.any(String),
            phone: {
                countryCode: expect.any(Number),
                phoneNumber: expect.any(String)
            },
            cpf: {
                cleaned: expect.any(String)
            },
            password: {
                hash: ''
            },
            barberShops: expect.any(Array)
        })


    })

    it('should return error message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .get('/manager/all')
            .set('Authorization', `Bearer `)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return error message "Unauthorized user" if provided token is not from admin user', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        const response = await request
            .get('/manager/all')
            .set('Authorization', `Bearer ${managerToken}`)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })
})