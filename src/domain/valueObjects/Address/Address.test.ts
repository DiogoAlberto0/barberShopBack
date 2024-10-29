import { describe, it, expect } from "vitest";
import { Address } from "./Address";

describe('Address class tests', () => {

    const address = new Address({
        zipCode: '71-805-709',
        country: 'Brasil',
        state: 'Distrito federal',
        city: 'Brasília',
        neighborhood: 'Riacho Fundo 1',
        street: 'QN 07 Conjunto 4',
        number: 43,
        complement: 'Na rua do mercado lucas'
    })

    it('should be able to instance a Address class', () => {
        expect(address).toBeInstanceOf(Address)
    })

    it('should be able to format a address with complement', () => {
        expect(address.toFormattedString()).toEqual('Brasil, Distrito federal, Brasília, Riacho Fundo 1, QN 07 Conjunto 4, 43, Na rua do mercado lucas')
    })

    it('should be able to format a address without complement', () => {
        const addressWithoutComplement = new Address({
            zipCode: '71-805-709',
            country: 'Brasil',
            state: 'Distrito federal',
            city: 'Brasília',
            neighborhood: 'Riacho Fundo 1',
            street: 'QN 07 Conjunto 4',
            number: 43
        })
        expect(addressWithoutComplement.toFormattedString()).toEqual('Brasil, Distrito federal, Brasília, Riacho Fundo 1, QN 07 Conjunto 4, 43')
    })

    it('should be able to instance a Address class', () => {



        expect(() => {
            new Address({
                zipCode: '1234',
                country: 'Brasil',
                state: 'Distrito federal',
                city: 'Brasília',
                neighborhood: 'Riacho Fundo 1',
                street: 'QN 07 Conjunto 4',
                number: 43
            })
        }).toThrow('CEP inválido')
    })
})