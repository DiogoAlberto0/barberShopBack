// Test Framework
import { describe, it, expect, beforeAll } from 'vitest';
import { request } from '../../../../test/integration/supertestConfig';
import { validBarber } from '../../../../test/validEntitiesFromTests/validBarber';
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests';
import { validManager } from '../../../../test/validEntitiesFromTests/validManager';


import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";

// Test Suite
describe('update barber phone and password controller', () => {

    let barberToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()

        const { body } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: validPassword
            })

        barberToken = body.token

        expect(barberToken).not.toBeUndefined()

    })

    it('should successfully update the phone and password of the barber', async () => {

        const newData = {
            phone: '61999999991',
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.',
        }
        const response = await request
            .put('/barber/updatePhoneAndPass')
            .set('Authorization', `Bearer ${barberToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone e senha atualizados com sucesso'
        })

        const loginResponse = await request
            .post('/barber/signin')
            .send({
                phone: newData.phone,
                password: newData.password
            })

        expect(loginResponse.body.token).not.toBeUndefined()
    });


    it('should return message "inform phone"', async () => {

        const newData = {
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.',
        }
        const response = await request
            .put('/barber/updatePhoneAndPass')
            .set('Authorization', `Bearer ${barberToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o telefone, a senha e a confirmação  da senha'
        })
    });

    it('should return message "inform password"', async () => {

        const newData = {
            phone: '61999999992',
            confirmPassword: '123456789Abc.',
        }
        const response = await request
            .put('/barber/updatePhoneAndPass')
            .set('Authorization', `Bearer ${barberToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o telefone, a senha e a confirmação  da senha'
        })
    });

    it('should return message "inform password confirmation"', async () => {

        const newData = {
            phone: '61999999992',
            password: '123456789Abc.',
        }
        const response = await request
            .put('/barber/updatePhoneAndPass')
            .set('Authorization', `Bearer ${barberToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Informe o telefone, a senha e a confirmação  da senha'
        })
    });

    it('should return message "phone number is already in use"', async () => {

        const newData = {
            phone: validManager.phone.phoneNumber,
            password: '123456789Abc.',
            confirmPassword: '123456789Abc.',
        }
        const response = await request
            .put('/barber/updatePhoneAndPass')
            .set('Authorization', `Bearer ${barberToken}`)
            .send({
                ...newData
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone já esta em uso'
        })
    });
});
