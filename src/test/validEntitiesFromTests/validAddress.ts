import { Address } from "../../domain/valueObjects/Address/Address";
export const validAddress = new Address({
    city: 'riacho',
    country: 'brasil',
    neighborhood: 'riacho',
    number: 10,
    state: 'brasilia',
    street: 'rua 10',
    zipCode: '71800000'
})

export const validAddress2 = new Address({
    city: 'rio de janeiro',
    country: 'brasil',
    neighborhood: 'penha',
    number: 11,
    state: 'rio de janeiro',
    street: 'rua 10',
    zipCode: '71800000'
})