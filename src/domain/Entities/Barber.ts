import { randomUUID } from "crypto";

//value objects
import { CPF } from "../valueObjects/CPF/CPF";
import { Password } from "../valueObjects/Password/Password";
import { Phone } from "../valueObjects/Phone/Phone";

//Entities
import { BarberShop } from "./BarberShop";

//erança
import { IUserBuildProps, IUserWithProps, User } from "./User";
import { Operation } from "./Operation";
import { DayOff } from "./DayOff";


type IBarberBuildProps = IUserBuildProps & {
    barberShop: BarberShop
}

type IBarberWithProps = IUserWithProps & {
    barberShop: BarberShop,
    operation: Operation[],
    daysOff: DayOff[]
}
export class Barber extends User {

    private constructor(
        id: string,
        name: string,
        phone: Phone,
        cpf: CPF,
        password: Password,
        public readonly barberShop: BarberShop,
        private operation: Operation[],
        private daysOff: DayOff[]
    ) {
        super(id, name, phone, cpf, password)
        this.barberShop = barberShop
    }

    static build({
        name,
        phone,
        cpf,
        password,
        barberShop
    }: IBarberBuildProps) {
        return new Barber(
            randomUUID(),
            name.toLowerCase(),
            phone,
            cpf,
            password,
            barberShop,
            [],
            []
        );
    }

    static with({
        id,
        name,
        phone,
        cpf,
        password,
        barberShop,
        operation,
        daysOff
    }: IBarberWithProps) {
        return new Barber(
            id,
            name.toLowerCase(),
            phone,
            cpf,
            password,
            barberShop,
            operation,
            daysOff
        );
    }

    getOperation = () => {
        return this.operation
    }

    setOperationDays = (operations: Operation[]) => {
        const counterElements: any = {}

        operations.forEach((operation) => {
            if (counterElements[operation.day.day]) {
                throw new Error('Não é permitido selecionar o mesmo dia da semana mais de uma vez.')
            }
            counterElements[operation.day.day] = true
        })

        this.operation = operations
    }

    addDayOff = (date: Date) => {
        const existendDayOff = this.daysOff.find((dayoff) => dayoff.date.getTime() == date.getTime())
        if (existendDayOff) throw new Error('Folga ja cadastrada!')

        this.daysOff.push(new DayOff(date))
    }

    removeDayOff = (date: Date) => {
        const existendDayOffIndex = this.daysOff.findIndex((dayoff) => dayoff.date.getTime() == date.getTime())
        if (existendDayOffIndex < 0) throw new Error('Folga não encontrada')

        this.daysOff.slice(existendDayOffIndex, 1)
    }

    getDaysOff = () => {
        return [...this.daysOff]
    }
}