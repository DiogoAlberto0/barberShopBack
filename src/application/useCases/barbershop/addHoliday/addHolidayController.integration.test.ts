import { describe, it, expect, beforeAll } from 'vitest'
import { testPrismaClient } from '../../../../test/integration/prisma'
import { request } from '../../../../test/integration/supertestConfig'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'
import { validPassword } from '../../../../test/validEntitiesFromTests/validEntitiesFromTests'
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager'


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";

describe('add holiday controller tests', () => {

    let managerToken: string
    const date = new Date()
    date.setMonth(new Date().getMonth() + 1)

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })


        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should add a holiday to a valid barbershop that is closed without open and close times', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: true
            })

        expect(response.body).toStrictEqual({
            message: 'Feriado cadastrado com sucesso'
        })

        const holiday = await testPrismaClient.holiday.findMany({})

        expect(holiday).toHaveLength(1)
        expect(holiday[0]).toStrictEqual({
            id: expect.any(String),
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            openHour: 0,
            openMinute: 0,
            closeHour: 0,
            closeMinute: 0,
            isClosed: true,
            barberShopId: validBarberShop.id
        })
    });

    it('should add a holiday to a valid barbershop that is not closed with open and close times', async () => {
        const newdate = new Date()
        newdate.setMonth(new Date().getMonth() + 1)
        newdate.setDate(new Date().getDate() + 1)

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date: newdate,
                isClosed: false,
                openTime: {
                    hour: 8,
                    minute: 0
                },
                closeTime: {
                    hour: 12,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Feriado cadastrado com sucesso'
        })

        const holiday = await testPrismaClient.holiday.findMany({})

        expect(holiday).toHaveLength(2)
        expect(holiday[1]).toStrictEqual({
            id: expect.any(String),
            date: new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate()),
            openHour: 8,
            openMinute: 0,
            closeHour: 12,
            closeMinute: 0,
            isClosed: false,
            barberShopId: validBarberShop.id
        })

    });

    it('should update holiday if hava a holiday with the same date', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 9,
                    minute: 0
                },
                closeTime: {
                    hour: 13,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Feriado cadastrado com sucesso'
        })

        const holiday = await testPrismaClient.holiday.findMany({})

        expect(holiday).toHaveLength(2)
        expect(holiday[0]).toStrictEqual({
            id: expect.any(String),
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            openHour: 9,
            openMinute: 0,
            closeHour: 13,
            closeMinute: 0,
            isClosed: false,
            barberShopId: validBarberShop.id
        })

    });

    it('should return message "barber shop not found"', async () => {

        const response = await request
            .post(`/barberShop/${1234}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 9,
                    minute: 0
                },
                closeTime: {
                    hour: 13,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })
    });

    it('should return message "If barber shop is opened, inform the open time and close time"', async () => {

        const response = await request
            .post(`/barberShop/${1234}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 9,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Se o estabelecimento estiver aberto favor informar o horário de abertura e fechamento'
        })
    });

    it('should return message "The hour must be between 0 and 23"', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 9,
                    minute: 0
                },
                closeTime: {
                    hour: 25,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'As horas devem estar entre 00 e 23'
        })
    });

    it('should return message "The minutes must be between 00 e 59"', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 9,
                    minute: 0
                },
                closeTime: {
                    hour: 12,
                    minute: 60
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Os minutos devem estar entre 00 e 59'
        })
    });

    it('should return message "The open time must be less than close time"', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 15,
                    minute: 0
                },
                closeTime: {
                    hour: 12,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'O horário de abertura deve ser anterior ao de fechamento'
        })
    });

    it('should return message "Unauthorized user" if a invalid token is provided', async () => {

        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${1234}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 15,
                    minute: 0
                },
                closeTime: {
                    hour: 12,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

    it('should return message "Unauthorized user" if manager is not from barber shop', async () => {

        await createAnValidManager2()
        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        expect(manager2token).not.toBeUndefined()


        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 15,
                    minute: 0
                },
                closeTime: {
                    hour: 12,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

    it('should return message "Unauthorized user" if token is not provided', async () => {


        const response = await request
            .post(`/barberShop/${validBarberShop.id}/addHoliday`)
            .set('Authorization', `Bearer`)
            .send({
                date,
                isClosed: false,
                openTime: {
                    hour: 15,
                    minute: 0
                },
                closeTime: {
                    hour: 12,
                    minute: 0
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });
})