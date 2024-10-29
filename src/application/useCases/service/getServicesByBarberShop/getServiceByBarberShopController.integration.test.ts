import { describe, it, expect, beforeAll } from "vitest";

import { request } from "../../../../test/integration/supertestConfig";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validService } from "../../../../test/validEntitiesFromTests/validService";


import { createAnValidManager } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop } from "../../../../test/integration/createValidData/createAnValidBarberShop";
import { createAnValidService, createAnValidInactiveService } from "../../../../test/integration/createValidData/createAnValidService";

describe('get services by barber shop use case tests', () => {


    beforeAll(async () => {

        await createAnValidManager()
        await createAnValidBarberShop()
        await createAnValidService()
        await createAnValidInactiveService()

    })
    it('should return only active services from a valid barber', async () => {

        const response = await request
            .get('/service/list')
            .query({
                barberShopId: validBarberShop.id
            })

        expect(response.body.services).toHaveLength(1)
        expect(response.body.services[0]).toStrictEqual({
            id: validService.id,
            name: validService.name,
            description: validService.description,
            price: {
                value: validService.price.getValue()
            },
            timeInMinutes: validService.timeInMinutes,
            barberShopId: validService.barberShopId
        })

    })

    it('should return message "barber shop not found"', async () => {
        const response = await request
            .get('/service/list')
            .query({
                barberShopId: '1234'
            })

        expect(response.body).toStrictEqual({
            message: 'Estabelecimento não encontrado'
        })
    })

    it('should return message "Inform barber shop id"', async () => {

        const response = await request
            .get('/service/list')


        expect(response.body).toStrictEqual({
            message: 'Informe a barbearia'
        })

    })

})