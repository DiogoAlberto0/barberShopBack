import { randomUUID } from 'node:crypto'
import { Operation } from "./Operation"
import { Phone } from '../valueObjects/Phone/Phone'
import { Address } from '../valueObjects/Address/Address'
import { Holiday } from './Holiday'

export class BarberShop {

    #holidays: Holiday[]

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly phone: Phone,
        public readonly address: Address,
        private operation: Operation[],
        holidays: Holiday[],
        private contractExpirationDate: Date,
        public readonly managerId: string,
        private barberLimit: number
    ) {
        this.#holidays = holidays
    }

    getManagerId = () => {
        return this.managerId
    }
    getBarberLimit = () => {
        return this.barberLimit
    }
    getOperation = () => {
        return this.operation
    }
    get holidays() {
        return this.#holidays
    }
    getAddress = () => {
        return this.address
    }
    getContractExpirationDate = () => {
        return this.contractExpirationDate
    }

    public static build = ({ name, phone, address, contractExpirationDate, managerId }: {
        name: string,
        phone: Phone,
        address: Address,
        contractExpirationDate: Date,
        managerId: string
    }) => {
        return new BarberShop(
            randomUUID(),
            name,
            phone,
            address,
            [],
            [],
            contractExpirationDate,
            managerId,
            10
        )
    }

    public static with = ({
        id,
        name,
        phone,
        address,
        holidays,
        operation,
        contractExpirationDate,
        managerId,
        barberLimit
    }:
        {
            id: string,
            name: string,
            phone: Phone,
            address: Address,
            operation: Operation[],
            holidays: Holiday[],
            contractExpirationDate: Date,
            managerId: string,
            barberLimit: number
        }
    ) => {
        return new BarberShop(
            id,
            name,
            phone,
            address,
            operation,
            holidays,
            contractExpirationDate,
            managerId,
            barberLimit
        )
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

    addHoliday = (holiday: Holiday) => {
        this.removeHoliday(holiday.props.date)
        this.#holidays.push(holiday)
    }

    removeHoliday = (date: Date) => {

        const newdate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        this.#holidays = this.#holidays.filter(holiday => holiday.props.date.getTime() != newdate.getTime())
    }

    incrementContractExpirationByMonth = (months: number) => {
        if (months < 0) throw new Error('A quantidade de mêses deve ser um numero positivo')
        const newDate = new Date(this.contractExpirationDate)
        newDate.setMonth(this.contractExpirationDate.getMonth() + months)

        this.contractExpirationDate = newDate

    }

    updateBarberLimit = (newLimit: number) => {
        if (newLimit <= 0) throw new Error('O limite deve ser positivo')
        this.barberLimit = newLimit
    }
}