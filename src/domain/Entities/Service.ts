import { randomUUID } from "crypto"
import { Price } from "../valueObjects/Price/Price"

type IBuildServiceProps = {
    name: string,
    description: string,
    price: Price,
    timeInMinutes: number,
    barberShopId: string
}

type IWithServiceProps = {
    id: string,
    name: string,
    description: string,
    price: Price,
    timeInMinutes: number,
    barberShopId: string
}
export class Service {

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: Price,
        public readonly timeInMinutes: number,
        public readonly barberShopId: string
    ) { }

    static build({ name, description, price, timeInMinutes, barberShopId }: IBuildServiceProps) {
        return new Service(randomUUID(), name, description, price, timeInMinutes, barberShopId)
    }

    static with({ id, name, description, price, timeInMinutes, barberShopId }: IWithServiceProps) {
        return new Service(id, name, description, price, timeInMinutes, barberShopId)
    }
}