
import { BarberShop } from "../../domain/Entities/BarberShop";
import { Operation } from "../../domain/Entities/Operation";
import { Phone } from "../../domain/valueObjects/Phone/Phone";
import { Time } from "../../domain/valueObjects/Time/Time";
import { WeekDay } from "../../domain/valueObjects/WeekDay/WeekDay";
import { validAddress, validAddress2 } from "./validAddress";
import { validManager, validManager2 } from "./validManager";


const createAnOperation = (weekDay: number, openHour: number, openMinute: number, closeHour: number, closeMinute: number) => {
    return new Operation(new WeekDay(weekDay), new Time({ hour: openHour, minute: openMinute }), new Time({ hour: closeHour, minute: closeMinute }))
}
const validBarberShopOperation =
    [
        createAnOperation(0, 0, 0, 0, 0),
        createAnOperation(1, 8, 0, 22, 0),
        createAnOperation(2, 8, 0, 22, 0),
        createAnOperation(3, 8, 0, 22, 0),
        createAnOperation(4, 8, 0, 22, 0),
        createAnOperation(5, 8, 0, 22, 0),
        createAnOperation(6, 8, 0, 22, 0)
    ]
const contractExpirationDate = new Date()
contractExpirationDate.setMonth(new Date().getMonth() + 1)
export const validBarberShop = BarberShop.build({
    name: 'Diogo Barber Shop',
    phone: new Phone('61999999995'),
    managerId: validManager.id,
    contractExpirationDate,
    address: validAddress
})

validBarberShop.setOperationDays(validBarberShopOperation)

export const validBarberShop2 = BarberShop.build({
    name: 'Diogo Barber , createAnValidBarberShop2',
    phone: new Phone('61999999994'),
    managerId: validManager2.id,
    contractExpirationDate,
    address: validAddress2
})

const date = new Date()
date.setMonth(new Date().getMonth() - 1)
export const validBarberShopContractExpirated = BarberShop.build({
    name: 'Diogo Barber , createAnValidBarberShop2',
    phone: new Phone('61999999993'),
    managerId: validManager.id,
    contractExpirationDate: date,
    address: validAddress
})