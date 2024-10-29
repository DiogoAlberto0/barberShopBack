import { describe, expect, it, beforeAll } from "vitest";
import { request } from "../../../../test/integration/supertestConfig";


import { createAnValidManager, createAnValidManager2 } from "../../../../test/integration/createValidData/createAnValidManager";
import { createAnValidBarberShop, createAnValidBarberShop2 } from "../../../../test/integration/createValidData/createAnValidBarberShop";

describe('get all barber shops controller tests', () => {

    beforeAll(async () => {
        await createAnValidManager()
        await createAnValidBarberShop()

        await createAnValidManager2()
        await createAnValidBarberShop2()
    })

    it('should return all barber shops', async () => {

        const response = await request
            .get('/barberShop/getAll')


        expect(response.body.barberShops).toHaveLength(2)
    })

    it('should return only one barber shop by page', async () => {

        const response = await request
            .get('/barberShop/getAll')
            .query({
                page: 1,
                pageSize: 1
            })

        expect(response.body.barberShops).toHaveLength(1)
    })

    it('should return barber shops filtered by country', async () => {
        const response = await request
            .get('/barberShop/getAll')
            .query({
                country: 'Bra'
            })

        expect(response.body.barberShops).toHaveLength(2)
    })
    it('should return barber shops filtered by country and paginated', async () => {
        const response = await request
            .get('/barberShop/getAll')
            .query({
                country: 'Bra',
                page: 1,
                pageSize: 1
            })

        expect(response.body.barberShops).toHaveLength(1)
    })

    it('should return barber shops filtered by state', async () => {
        const response = await request
            .get('/barberShop/getAll')
            .query({
                state: 'brasilia'
            })

        expect(response.body.barberShops).toHaveLength(1)
    })

    it('should return barber shops filtered by state', async () => {
        const response = await request
            .get('/barberShop/getAll')
            .query({
                city: 'rio'
            })

        expect(response.body.barberShops).toHaveLength(1)
    })

    it('should return barber shops filtered by neighborhood', async () => {
        const response = await request
            .get('/barberShop/getAll')
            .query({
                city: 'rio'
            })

        expect(response.body.barberShops).toHaveLength(1)
    })

})