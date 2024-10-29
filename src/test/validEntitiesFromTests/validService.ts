import { Service } from "../../domain/Entities/Service";
import { Price } from "../../domain/valueObjects/Price/Price";
import { validBarberShop } from "./validBarberShop";

export const validService = Service.build({
    name: 'Corte simples',
    description: 'lorem ipsum dolor amiet',
    price: new Price(50),
    timeInMinutes: 60,
    barberShopId: validBarberShop.id
})
export const validService2 = Service.build({
    name: 'Barba e cabelo',
    description: 'lorem ipsum dolor amiet',
    price: new Price(70),
    timeInMinutes: 60,
    barberShopId: validBarberShop.id
})