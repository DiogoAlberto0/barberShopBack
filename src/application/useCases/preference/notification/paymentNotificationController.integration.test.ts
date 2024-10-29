import { describe, it, expect, beforeAll } from "vitest";
import { request } from "../../../../test/integration/supertestConfig";

describe('payment notification controller tests', () => {


    beforeAll(async () => {

    })

    it('should increment contract expiration', async () => {

        const response = await request
            .post(`/barberShop/validatePayment`)
            .send({
                type: 'payment',
                data: {
                    id: 'asdf123'
                }
            })

        console.log(response.body)
    })
})