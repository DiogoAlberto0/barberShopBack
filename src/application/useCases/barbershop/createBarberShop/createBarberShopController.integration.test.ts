import { beforeAll, describe, expect, it } from "vitest"
import { testPrismaClient } from "../../../../test/integration/prisma"
import { request } from "../../../../test/integration/supertestConfig"


import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin"
import { validBarberShop, validBarberShop2 } from "../../../../test/validEntitiesFromTests/validBarberShop"
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests"
import { validManager } from "../../../../test/validEntitiesFromTests/validManager"

import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";


describe('create barber shop controller tests', () => {

    let adminToken: string

    const validBarberShopAddress = {
        country: validBarberShop.address.props.country,
        state: validBarberShop.address.props.state,
        city: validBarberShop.address.props.city,
        neighborhood: validBarberShop.address.props.neighborhood,
        street: validBarberShop.address.props.street,
        number: validBarberShop.address.props.number,
        zipCode: validBarberShop.address.props.zipCode,
    }

    const validBarberShopAddress2 = {
        country: validBarberShop2.address.props.country,
        state: validBarberShop2.address.props.state,
        city: validBarberShop2.address.props.city,
        neighborhood: validBarberShop2.address.props.neighborhood,
        street: validBarberShop2.address.props.street,
        number: validBarberShop2.address.props.number,
        zipCode: validBarberShop2.address.props.zipCode,
    }

    beforeAll(async () => {
        await createAnValidManager()

        const { body } = await request
            .post('/admin/signin')
            .send({
                phone: validAdmin.phone.phoneNumber,
                password: validPassword
            })

        adminToken = body.token

        expect(adminToken).not.toBeUndefined()
    })

    const contractExpirationDate = new Date()
    contractExpirationDate.setMonth(new Date().getMonth() + 1)

    it('should be possible to create an new barber shop', async () => {

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop.name,
                phone: validBarberShop.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop.getContractExpirationDate(),
                address: validBarberShopAddress
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento cadastrado com sucesso'
        })

        const barberShops = await testPrismaClient.barberShop.findMany()

        expect(barberShops).toHaveLength(1)
    })

    //phone number errors
    it('should return message "barber shop phone is already in use"', async () => {

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop.getContractExpirationDate(),
                address: validBarberShopAddress
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone já está em uso'
        })
    })

    it('should return message "invalid phone number"', async () => {

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: '61339939',
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop.getContractExpirationDate(),
                address: validBarberShopAddress
            })

        expect(response.body).toStrictEqual({
            message: 'Telefone inválido'
        })

        const response2 = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: 'asdfgasdfgh',
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop.getContractExpirationDate(),
                address: validBarberShopAddress
            })

        expect(response2.body).toStrictEqual({
            message: 'Telefone inválido'
        })
    })

    //address errors
    it('should return message "inform all address data"', async () => {

        const countryError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    number: validBarberShop.address.props.number,
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(countryError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })

        const stateError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    number: validBarberShop.address.props.number,
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(stateError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })


        const cityError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    number: validBarberShop.address.props.number,
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(cityError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })

        const neighborhoodError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    street: validBarberShop.address.props.street,
                    number: validBarberShop.address.props.number,
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(neighborhoodError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })

        const streetError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    number: validBarberShop.address.props.number,
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(streetError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })

        const numberError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(numberError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })

        const zipCodeError = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    number: validBarberShop.address.props.number,
                }
            })

        expect(zipCodeError.body).toStrictEqual({
            message: 'O endereço deve conter: país, estado, cidade, bairro, rua, numero e CEP'
        })
    })

    it('should return message "invalid number"', async () => {
        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    number: 'cinco',
                    zipCode: validBarberShop.address.props.zipCode,
                }
            })

        expect(response.body).toStrictEqual({
            message: 'Número do endereço inválido'
        })
    })

    it('should return message "invalid zip code"', async () => {
        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: {
                    country: validBarberShop.address.props.country,
                    state: validBarberShop.address.props.state,
                    city: validBarberShop.address.props.city,
                    neighborhood: validBarberShop.address.props.neighborhood,
                    street: validBarberShop.address.props.street,
                    number: validBarberShop2.address.props.number,
                    zipCode: '123',
                }
            })

        expect(response.body).toStrictEqual({
            message: 'CEP inválido'
        })
    })

    it('should return message "address is already in use"', async () => {
        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: validBarberShop2.getContractExpirationDate(),
                address: validBarberShopAddress
            })

        expect(response.body).toStrictEqual({
            message: 'Endereço já está em uso'
        })
    })


    // contract expiration date error
    it('should return message "Invalid contract expiration Date"', async () => {

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: 'asd',
                address: validBarberShopAddress2
            })

        expect(response.body).toStrictEqual({
            message: 'Date de expiração de contrato inválida'
        })
    })

    it('should return message "the contract expiration date must be more than now"', async () => {

        const invalidContractExpirationDate = new Date()
        invalidContractExpirationDate.setDate(new Date().getDate() - 1)

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate: invalidContractExpirationDate,
                address: validBarberShopAddress2
            })

        expect(response.body).toStrictEqual({
            message: 'A data da expiração de contrato deve ser anterior a data atual'
        })

    })

    //authentication errors

    it('should return message "Unauthorized user" if provided token is not from admin user', async () => {

        const { body: { token: managerToken } } = await request
            .post('/manager/signin')
            .send({
                phone: validManager.phone.phoneNumber,
                password: validPassword
            })

        expect(managerToken).not.toBeUndefined()

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate,
                address: validBarberShopAddress2
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

    it('should return message "Unauthorized user" if token is not provided', async () => {

        const response = await request
            .post('/barberShop/create')
            .set('Authorization', `Bearer ${123}`)
            .send({
                name: validBarberShop2.name,
                phone: validBarberShop2.phone.phoneNumber,
                managerId: validBarberShop.managerId,
                contractExpirationDate,
                address: validBarberShopAddress2
            })

        expect(response.body).toStrictEqual({
            message: 'Usuário não autorizado'
        })

    })

})
