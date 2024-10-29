import { describe, it, expect, beforeAll } from "vitest";
import { request } from "../../../../test/integration/supertestConfig";
import { validBarber, validBarber2 } from "../../../../test/validEntitiesFromTests/validBarber";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";


import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber, createAnValidBarber2 } from "../../../../test/integration/createValidData/createAnValidBarber";
import { createAnValidAppointments } from "../../../../test/integration/createValidData/createAnValidAppointment";
import { createAnValidService } from "../../../../test/integration/createValidData/createAnValidService";
import { createAnValidCustomer } from "../../../../test/integration/createValidData/createAnValidCustomer";

describe('get appointments by barber controller tests', () => {

    let barberToken: string

    beforeAll(async () => {


        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()
        await createAnValidService()
        await createAnValidCustomer()

        await createAnValidAppointments(30)

        await createAnValidBarber2()

        const { body } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber.phone.phoneNumber,
                password: validPassword
            })

        barberToken = body.token

        expect(barberToken).not.toBeUndefined()

    })


    it('should be return all appointment from authenticated barber', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)

        const appointments = response.body.appointments

        expect(appointments).toHaveLength(30)
        expect(response.body.totalCount).toStrictEqual(30)
        expect(appointments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    date: expect.any(String),
                    startsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    endsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    status: expect.any(String),
                    service: expect.any(Object),
                    customerId: expect.any(String),
                    barberShopId: expect.any(String),
                    barberId: expect.any(String),
                })

            ])
        )

        const expectedDate = new Date()
        const now = new Date()
        expectedDate.setDate(now.getDate() + 1)

        expect(new Date(appointments[0].date).getDate()).toStrictEqual(expectedDate.getDate())
        expect(new Date(appointments[0].date).getMonth()).toStrictEqual(expectedDate.getMonth())
        expect(new Date(appointments[0].date).getFullYear()).toStrictEqual(expectedDate.getFullYear())

        expectedDate.setDate(now.getDate() + 30)
        expect(new Date(appointments[29].date).getDate()).toStrictEqual(expectedDate.getDate())
        expect(new Date(appointments[29].date).getMonth()).toStrictEqual(expectedDate.getMonth())
        expect(new Date(appointments[29].date).getFullYear()).toStrictEqual(expectedDate.getFullYear())
    })

    it('should be return page 1 with limit per page equals 10 appointment from authenticated barber', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                page: 1,
                pageSize: 10
            })


        const appointments = response.body.appointments
        expect(appointments).toHaveLength(10)
        expect(response.body.totalCount).toStrictEqual(30)
        expect(appointments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    date: expect.any(String),
                    startsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    endsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    status: expect.any(String),
                    service: expect.any(Object),
                    customerId: expect.any(String),
                    barberShopId: expect.any(String),
                    barberId: expect.any(String),
                })
            ])
        )

        const now = new Date()
        const firstExpectedDate = new Date()
        firstExpectedDate.setDate(now.getDate() + 1)

        expect(new Date(appointments[0].date).getDate()).toStrictEqual(firstExpectedDate.getDate())
        expect(new Date(appointments[0].date).getMonth()).toStrictEqual(firstExpectedDate.getMonth())
        expect(new Date(appointments[0].date).getFullYear()).toStrictEqual(firstExpectedDate.getFullYear())


        const lastExpectedDate = new Date()
        lastExpectedDate.setDate(now.getDate() + 10)
        expect(new Date(appointments[9].date).getDate()).toStrictEqual(lastExpectedDate.getDate())
        expect(new Date(appointments[9].date).getMonth()).toStrictEqual(lastExpectedDate.getMonth())
        expect(new Date(appointments[9].date).getFullYear()).toStrictEqual(lastExpectedDate.getFullYear())

    })

    it('should be return page 2 and limit per page equals 10 appointment from authenticated barber', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                page: 2,
                pageSize: 10
            })


        const appointments = response.body.appointments
        expect(appointments).toHaveLength(10)
        expect(response.body.totalCount).toStrictEqual(30)
        expect(appointments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    date: expect.any(String),
                    startsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    endsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    status: expect.any(String),
                    service: expect.any(Object),
                    customerId: expect.any(String),
                    barberShopId: expect.any(String),
                    barberId: expect.any(String),
                })
            ])
        )

        const now = new Date()

        const firstExpectedDate = new Date()
        firstExpectedDate.setDate(now.getDate() + 11)

        expect(new Date(appointments[0].date).getDate()).toStrictEqual(firstExpectedDate.getDate())
        expect(new Date(appointments[0].date).getMonth()).toStrictEqual(firstExpectedDate.getMonth())
        expect(new Date(appointments[0].date).getFullYear()).toStrictEqual(firstExpectedDate.getFullYear())

        const lastExpectedDate = new Date()
        lastExpectedDate.setDate(now.getDate() + 20)
        expect(new Date(appointments[9].date).getDate()).toStrictEqual(lastExpectedDate.getDate())
        expect(new Date(appointments[9].date).getMonth()).toStrictEqual(lastExpectedDate.getMonth())
        expect(new Date(appointments[9].date).getFullYear()).toStrictEqual(lastExpectedDate.getFullYear())

    })

    it('should be return only appointments from informated date from authenticated barber', async () => {

        const now = new Date()
        const date = new Date()
        date.setDate(now.getDate() + 1)

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                date
            })


        const appointments = response.body.appointments
        expect(appointments).toHaveLength(1)
        expect(response.body.totalCount).toStrictEqual(1)
        expect(appointments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    date: expect.any(String),
                    startsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    endsAt: {
                        props: {
                            hour: expect.any(Number),
                            minute: expect.any(Number)
                        }
                    },
                    status: expect.any(String),
                    service: expect.any(Object),
                    customerId: expect.any(String),
                    barberShopId: expect.any(String),
                    barberId: expect.any(String),
                })
            ])
        )

        expect(new Date(appointments[0].date).getDate()).toStrictEqual(date.getDate())
        expect(new Date(appointments[0].date).getMonth()).toStrictEqual(date.getMonth())
        expect(new Date(appointments[0].date).getFullYear()).toStrictEqual(date.getFullYear())
    })

    it('should be return page 2 and limit per page equals 10 appointment from authenticated barber', async () => {

        const { body } = await request
            .post('/barber/signin')
            .send({
                phone: validBarber2.phone.phoneNumber,
                password: validPassword
            })

        const barberToken2 = body.token

        expect(barberToken2).not.toBeUndefined()

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken2}`)

        const appointments = response.body.appointments
        expect(appointments).toHaveLength(0)
        expect(response.body.totalCount).toStrictEqual(0)
        expect(appointments).toEqual([])

    })

    it('should be return message "Unauthorized user" if invalid token is provided', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${123}`)

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should be return message "invalid pagination data" ', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                page: -10,
                pageSize: -1
            })


        expect(response.body).toStrictEqual({
            message: 'Informe uma página e uma quantidade de registros por páginas válidos'
        })
    })

    it('should be return message "invalid pagination data" if negative number is provided', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                page: -10,
                pageSize: -1
            })


        expect(response.body).toStrictEqual({
            message: 'Informe uma página e uma quantidade de registros por páginas válidos'
        })
    })

    it('should be return message "invalid pagination data" if not a number is provided', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                page: 'asd',
                pageSize: 'asd'
            })


        expect(response.body).toStrictEqual({
            message: 'Informe uma página e uma quantidade de registros por páginas válidos'
        })
    })


    it('should be return message "invalid date"', async () => {

        const response = await request
            .get('/appointment/byBarber')
            .set('Authorization', `Bearer ${barberToken}`)
            .query({
                date: 'asd'
            })


        expect(response.body).toStrictEqual({
            message: 'Favor informar uma data válida'
        })
    })
})