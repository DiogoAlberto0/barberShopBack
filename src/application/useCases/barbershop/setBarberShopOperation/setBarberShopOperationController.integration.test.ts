; import { describe, it, expect, beforeAll } from "vitest";
import { testPrismaClient } from "../../../../test/integration/prisma";
import { request } from "../../../../test/integration/supertestConfig";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";



import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop, createAnValidBarberShop2 } from "../../../../test/integration/createValidData/createAnValidBarberShop";

const validOperation = {
    open: {
        hour: 8,
        minute: 0
    },
    close: {
        hour: 12,
        minute: 0
    }
}
describe('set barber shop operation controller tests', () => {

    let managerToken: string
    let manager2token: string
    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()

        await createAnValidManager2()
        await createAnValidBarberShop2()

        const { body: { token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = token

        expect(managerToken).not.toBeUndefined()

        const { body: { token: token2 } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })

        manager2token = token2

        expect(manager2token).not.toBeUndefined()
    })

    it('should be possible to set barber shop operation', async () => {

        const operationObj: { [key: number]: typeof validOperation | null } = {
            0: validOperation,
            1: validOperation,
            2: validOperation,
            3: validOperation,
            4: validOperation,
            5: validOperation,
            6: null
        }
        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: operationObj
            })

        expect(response.body).toStrictEqual({
            message: 'Funcionamento do estabelecimento atualizado com sucesso'
        })

        const { operation } = await testPrismaClient.barberShop.findUniqueOrThrow({
            where: {
                id: validBarberShop.id
            },
            select: {
                operation: true
            }
        })

        operation.forEach((op) => {

            if (op.weekDay < 0 || op.weekDay > 6) return
            const currentOperation = operationObj[op.weekDay]
            expect(op.openHour).toStrictEqual(currentOperation?.open.hour || 0)
            expect(op.openMinute).toStrictEqual(currentOperation?.open.minute || 0)
            expect(op.closeHour).toStrictEqual(currentOperation?.close.hour || 0)
            expect(op.closeMinute).toStrictEqual(currentOperation?.close.minute || 0)
        })


    })

    it('should be possible to update barber shop operation', async () => {

        const operationObj: { [key: number]: typeof validOperation | null } = {
            0: validOperation,
            1: validOperation,
            2: validOperation,
            3: validOperation,
            4: validOperation,
            5: {
                open: {
                    hour: 9,
                    minute: 0
                },
                close: {
                    hour: 13,
                    minute: 0
                }
            },
            6: null
        }
        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: operationObj
            })

        expect(response.body).toStrictEqual({
            message: 'Funcionamento do estabelecimento atualizado com sucesso'
        })

        const { operation } = await testPrismaClient.barberShop.findUniqueOrThrow({
            where: {
                id: validBarberShop.id
            },
            select: {
                operation: true
            }
        })

        operation.forEach((op) => {

            if (op.weekDay < 0 || op.weekDay > 6) return
            const currentOperation = operationObj[op.weekDay]
            expect(op.openHour).toStrictEqual(currentOperation?.open.hour || 0)
            expect(op.openMinute).toStrictEqual(currentOperation?.open.minute || 0)
            expect(op.closeHour).toStrictEqual(currentOperation?.close.hour || 0)
            expect(op.closeMinute).toStrictEqual(currentOperation?.close.minute || 0)
        })


    })

    it('should return message "Inform all days week"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,

                }
            })

        expect(response.body).toStrictEqual({
            message: 'Informe todos os dias da semana começando do 0 para domingo até o 6 para segunda'
        })
    })

    it('should return message "all days should have an open and close time or null if the barber shop is closed"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: {}
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o estabelecimento não funcione'
        })
    })

    it('should return message "the open and close time should be have an hour an minute integer numbers"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: {
                        open: {},
                        close: {}
                    }
                }
            })

        expect(response.body).toStrictEqual({
            message: 'A abertura e o fechamento deve ter as horas e os minutos correspondentes'
        })
    })

    it('should return message "the hour must be between 0 and 23"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: {
                        open: {
                            hour: 8,
                            minute: 0
                        },
                        close: {
                            hour: 25,
                            minute: 0
                        }
                    }
                }
            })

        expect(response.body).toStrictEqual({
            message: 'As horas devem estar entre 00 e 23'
        })
    })

    it('should return message "the minutes must be between 0 and 59"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: {
                        open: {
                            hour: 8,
                            minute: 0
                        },
                        close: {
                            hour: 12,
                            minute: 60
                        }
                    }
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Os minutos devem estar entre 00 e 59'
        })
    })

    it('should return message "the open time must be before close time"', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: {
                        open: {
                            hour: 12,
                            minute: 0
                        },
                        close: {
                            hour: 8,
                            minute: 0
                        }
                    }
                }
            })

        expect(response.body).toStrictEqual({
            message: 'O horário de abertura deve ser anterior ao horario de fechamento'
        })
    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: validOperation
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if invalid token is provided', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${123}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: validOperation
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "Unauthorized user" if provided token is from manager from another barber shop', async () => {

        const response = await request
            .put(`/barberShop/${validBarberShop.id}/setOperation`)
            .set('Authorization', `Bearer ${manager2token}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: validOperation
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    })

    it('should return message "barber shop is not found"', async () => {

        const response = await request
            .put(`/barberShop/${123}/setOperation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: validOperation,
                    1: validOperation,
                    2: validOperation,
                    3: validOperation,
                    4: validOperation,
                    5: validOperation,
                    6: validOperation
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })
    })

})