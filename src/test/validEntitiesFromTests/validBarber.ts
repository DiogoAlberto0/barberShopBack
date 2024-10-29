import { Operation } from "../../domain/Entities/Operation";
import { CPF } from "../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../domain/valueObjects/Phone/Phone";
import { Time } from "../../domain/valueObjects/Time/Time";
import { WeekDay } from "../../domain/valueObjects/WeekDay/WeekDay";
import { Barber } from "../../domain/Entities/Barber";
import { validBarberShop } from "./validBarberShop";
import { validPasswordObj } from "./validEntitiesFromTests";

const createAnOperation = (weekDay: number, openHour: number, openMinute: number, closeHour: number, closeMinute: number) => {
    return new Operation(new WeekDay(weekDay), new Time({ hour: openHour, minute: openMinute }), new Time({ hour: closeHour, minute: closeMinute }))
}

const validBarberOperation =
    [
        createAnOperation(0, 0, 0, 0, 0),
        createAnOperation(1, 8, 0, 20, 0),
        createAnOperation(2, 8, 0, 20, 0),
        createAnOperation(3, 8, 0, 20, 0),
        createAnOperation(4, 8, 0, 20, 0),
        createAnOperation(5, 8, 0, 20, 0),
        createAnOperation(6, 0, 0, 0, 0)
    ]

export const validBarber = Barber.build({
    name: 'Barber 1',
    phone: new Phone('61999999992'),
    password: validPasswordObj,
    barberShop: validBarberShop,
    cpf: new CPF('051.147.870-47')
})

validBarber.setOperationDays(validBarberOperation)

export const validBarber2 = Barber.build({
    name: 'Barber 2',
    phone: new Phone('61999999991'),
    password: validPasswordObj,
    barberShop: validBarberShop,
    cpf: new CPF('805.449.770-92')
})