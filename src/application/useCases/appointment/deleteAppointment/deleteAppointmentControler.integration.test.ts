import { describe, it, expect, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validAppointment } from "../../../../test/validEntitiesFromTests/validAppointments";
import { validCustomer } from "../../../../test/validEntitiesFromTests/validCustomer";


import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";
import { createAnValidAppointment } from "../../../../test/integration/createValidData/createAnValidAppointment";
import { createAnValidService } from "../../../../test/integration/createValidData/createAnValidService";
import { createAnValidCustomer } from "../../../../test/integration/createValidData/createAnValidCustomer";

describe('delete appointment controller tests', () => {

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()
        await createAnValidService()
        await createAnValidCustomer()
        await createAnValidAppointment(new Date())
    })

    it('should return message "Appointment not found"', async () => {

        const response = await request
            .delete(`/appointment/${123}/delete`)
            .send({
                customerName: validCustomer.name,
                customerCPF: validCustomer.cpf.cleaned,
                customerPhone: validCustomer.phone.phoneNumber
            })

        expect(response.body).toStrictEqual({
            message: 'Agendamento não encontrado'
        })



        const appointment = await testPrismaClient.appointment.findFirstOrThrow()

        expect(appointment.status).toStrictEqual('OPENED')
    })

    it('should return "Unauthorized customer" if informed customer name is not the same from appointment', async () => {

        const response = await request
            .delete(`/appointment/${validAppointment.id}/delete`)
            .send({
                customerName: 'invalid customer name',
                customerCPF: validCustomer.cpf.cleaned,
                customerPhone: validCustomer.phone.phoneNumber
            })

        expect(response.body).toStrictEqual({
            message: 'Cliente não autorizado'
        })



        const appointment = await testPrismaClient.appointment.findFirstOrThrow()

        expect(appointment.status).toStrictEqual('OPENED')
    })

    it('should return "Unauthorized customer" if informed customer cpf is not the same from appointment', async () => {

        const response = await request
            .delete(`/appointment/${validAppointment.id}/delete`)
            .send({
                customerName: validCustomer.name,
                customerCPF: '562.678.120-06',
                customerPhone: validCustomer.phone.phoneNumber
            })

        expect(response.body).toStrictEqual({
            message: 'Cliente não autorizado'
        })



        const appointment = await testPrismaClient.appointment.findFirstOrThrow()

        expect(appointment.status).toStrictEqual('OPENED')
    })

    it('should return "Unauthorized customer" if informed customer phone number is not the same from appointment', async () => {

        const response = await request
            .delete(`/appointment/${validAppointment.id}/delete`)
            .send({
                customerName: validCustomer.name,
                customerCPF: validCustomer.cpf.cleaned,
                customerPhone: '61888888888'
            })

        expect(response.body).toStrictEqual({
            message: 'Cliente não autorizado'
        })



        const appointment = await testPrismaClient.appointment.findFirstOrThrow()

        expect(appointment.status).toStrictEqual('OPENED')
    })


    it('should possible to delete appointment', async () => {

        const response = await request
            .delete(`/appointment/${validAppointment.id}/delete`)
            .send({
                customerName: validCustomer.name,
                customerCPF: validCustomer.cpf.cleaned,
                customerPhone: validCustomer.phone.phoneNumber
            })

        expect(response.body).toStrictEqual({
            message: 'Agendamento cancelado com sucesso'
        })



        const appointment = await testPrismaClient.appointment.findFirstOrThrow()

        expect(appointment.status).toStrictEqual('CANCELED')
    })
})