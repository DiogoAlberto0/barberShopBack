import { describe, it, expect, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validManager } from "../../../../test/validEntitiesFromTests/validManager";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validAppointment, validAppointment2 } from "../../../../test/validEntitiesFromTests/validAppointments";
import { validBarber, validBarber2 } from "../../../../test/validEntitiesFromTests/validBarber";

import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop, createAnValidBarberShop2 } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber, createAnValidBarber2 } from "../../../../test/integration/createValidData/createAnValidBarber";
import { createAnValidAppointment, createAnValidAppointment2 } from "../../../../test/integration/createValidData/createAnValidAppointment";
import { createAnValidService } from "../../../../test/integration/createValidData/createAnValidService";
import { createAnValidCustomer } from "../../../../test/integration/createValidData/createAnValidCustomer";

describe('set closed status controller tests', () => {

    let managerToken: string

    beforeAll(async () => {

        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()
        await createAnValidService()
        await createAnValidCustomer()
        await createAnValidAppointment(new Date())

        await createAnValidManager2()
        await createAnValidBarberShop2()
        await createAnValidBarber2()
        await createAnValidAppointment2(new Date())

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should be possible to set closed status from a valid appointment by authenticated manager', async () => {

        const response = await request
            .put(`/appointment/${validAppointment.id}/setClosed`)
            .set('Authorization', `Bearer ${managerToken}`)

        expect(response.body).toStrictEqual({
            message: 'Agendamento concluido com sucesso'
        })

        const appointment = await testPrismaClient.appointment.findUnique({
            where: {
                id: validAppointment.id
            }
        })

        expect(appointment?.status).toStrictEqual('CLOSED')
    })

    it('should not be possible to set closed if appointment is already closed', async () => {

        const response = await request
            .put(`/appointment/${validAppointment.id}/setClosed`)
            .set('Authorization', `Bearer ${managerToken}`)

        expect(response.body).toStrictEqual({
            message: 'Agendamento já está fechado'
        })

    })

    it('should return message "Unauthorized user" if manager is not from the appointment barber shop', async () => {

        const response = await request
            .put(`/appointment/${validAppointment2.id}/setClosed`)
            .set('Authorization', `Bearer ${managerToken}`)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if invalid token is provided', async () => {

        const response = await request
            .put(`/appointment/${validAppointment2.id}/setClosed`)
            .set('Authorization', `Bearer ${123}`)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if authenticated barber is not the same from appointment', async () => {

        const { body: { token: invalidBarberToken } } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: validPassword
            })

        expect(invalidBarberToken).not.toBeUndefined()

        const response = await request
            .put(`/appointment/${validAppointment2.id}/setClosed`)
            .set('Authorization', `Bearer ${invalidBarberToken}`)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if authenticated barber is not the same from appointment', async () => {

        const { body: { token: validBarberToken } } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber2.phone.phoneNumber,
                password: validPassword
            })

        expect(validBarberToken).not.toBeUndefined()

        const response = await request
            .put(`/appointment/${validAppointment2.id}/setClosed`)
            .set('Authorization', `Bearer ${validBarberToken}`)

        expect(response.body).toStrictEqual({
            message: 'Agendamento concluido com sucesso'
        })
    })

    it('should return message "Not is possible to close an CANCELED appointment"', async () => {

        await testPrismaClient.appointment.update({
            where: { id: validAppointment2.id },
            data: { status: 'CANCELED' }
        })

        const { body: { token: validBarberToken } } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber2.phone.phoneNumber,
                password: validPassword
            })

        expect(validBarberToken).not.toBeUndefined()

        const response = await request
            .put(`/appointment/${validAppointment2.id}/setClosed`)
            .set('Authorization', `Bearer ${validBarberToken}`)

        expect(response.body).toStrictEqual({
            message: 'Não é possível fechar um agendamento cancelado'
        })
    })
})