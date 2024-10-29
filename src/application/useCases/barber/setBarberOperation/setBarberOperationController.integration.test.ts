import { describe, it, expect, beforeAll } from "vitest";
import { request } from "../../../../test/integration/supertestConfig";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidBarber } from "../../../../test/integration/createValidData/createAnValidBarber";
// Função auxiliar para criar operações dinâmicas
const createOperation = (openHour: number, openMinute: number, closeHour: number, closeMinute: number) => ({
    open: { hour: openHour, minute: openMinute },
    close: { hour: closeHour, minute: closeMinute }
});

describe('set operation use case tests', () => {

    let managerToken: string

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidBarber()

        const { body } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        managerToken = body.token

        expect(managerToken).not.toBeUndefined()
    })

    it('should be possible to set a valid operation to a valid barber any times', async () => {

        const response = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: createOperation(8, 0, 18, 0),
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response.status).toStrictEqual(200)
        expect(response.body).toStrictEqual({
            message: 'Carga horária do funcionário atualizada com sucesso'
        })

        const response2 = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: createOperation(8, 0, 18, 0),
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response2.status).toStrictEqual(200)
        expect(response2.body).toStrictEqual({
            message: 'Carga horária do funcionário atualizada com sucesso'
        })
    });

    it('should return message "invalid barber id is provided"', async () => {
        const response = await request
            .put(`/barber/${123}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: createOperation(8, 0, 18, 0),
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Funcionário não encontrado'
        })
    });

    it('should return message "Invalid operation is provided"', async () => {
        const response = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: 'invalid operation',
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o funcionário não trabalhe'
        })

        const response2 = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: 1,
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response2.status).toStrictEqual(400)
        expect(response2.body).toStrictEqual({
            message: 'Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o funcionário não trabalhe'
        })

        const response3 = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: {
                        hello: 'world'
                    },
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response3.status).toStrictEqual(400)
        expect(response3.body).toStrictEqual({
            message: 'Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o funcionário não trabalhe'
        })

        const response4 = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: [1, 2],
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response4.status).toStrictEqual(400)
        expect(response4.body).toStrictEqual({
            message: 'Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o funcionário não trabalhe'
        })
    });

    it('should return message "Invalid time is provided"', async () => {
        const response = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: {
                        open: {},
                        close: {}
                    },
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'A abertura e o fechamento deve ter as horas e os minutos correspondentes'
        })

        const response2 = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: {
                        open: '',
                        close: ''
                    },
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response2.status).toStrictEqual(400)
        expect(response2.body).toStrictEqual({
            message: 'Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o funcionário não trabalhe'
        })

        const response3 = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                operation: {
                    0: {
                        open: {
                            hour: 'asdf',
                            minute: 'asdf'
                        },
                        close: {
                            hour: 'asdf',
                            minute: 'asdf'
                        }
                    },
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response3.status).toStrictEqual(400)
        expect(response3.body).toStrictEqual({
            message: 'A abertura e o fechamento deve ter as horas e os minutos correspondentes'
        })
    });

    it('should return message "Unauthorized user" if token is not provided', async () => {
        const response = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer `)
            .send({
                operation: {
                    0: createOperation(8, 0, 18, 0),
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

    it('should return message "Unauthorized user" if manager is not from the same barber shop as the barber', async () => {

        await createAnValidManager2()
        const { body: { token: manager2token } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager2.phone.phoneNumber,
                password: validPassword
            })
        expect(manager2token).not.toBeUndefined()

        const response = await request
            .put(`/barber/${validBarber.id}/operation`)
            .set('Authorization', `Bearer  ${manager2token}`)
            .send({
                operation: {
                    0: createOperation(8, 0, 18, 0),
                    1: null,
                    2: createOperation(8, 0, 18, 0),
                    3: createOperation(8, 0, 18, 0),
                    4: createOperation(8, 0, 18, 0),
                    5: createOperation(8, 0, 18, 0),
                    6: createOperation(8, 0, 18, 0),
                }
            })


        expect(response.status).toStrictEqual(400)
        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })
    });

});
