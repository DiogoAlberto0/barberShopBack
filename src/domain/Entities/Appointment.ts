import { randomUUID } from "crypto";

//value object
import { Time } from "../valueObjects/Time/Time";

//entites
import { Service } from "./Service";

type IAppointmentStatus = 'CANCELED' | 'OPENED' | 'CLOSED'

type IAppointmentBuildProps = {
    date: Date,
    startsAt: Time
    service: Service,
    customerId: string,
    barberShopId: string,
    barberId: string
}

type IAppointmentWithProps = {
    id: string,
    date: Date,
    startsAt: Time,
    service: Service,
    customerId: string,
    barberShopId: string,
    barberId: string,
    status: IAppointmentStatus
}
export class Appointment {


    private constructor(
        public readonly id: string,
        public readonly date: Date,
        public readonly startsAt: Time,
        public readonly endsAt: Time,
        public readonly status: IAppointmentStatus,
        public readonly service: Service,
        public readonly customerId: string,
        public readonly barberShopId: string,
        public readonly barberId: string,
    ) { }

    static build({
        date,
        service,
        barberId,
        barberShopId,
        customerId,
        startsAt
    }: IAppointmentBuildProps) {
        const endsAt = startsAt.increment(service.timeInMinutes)

        const appointment = new Appointment(
            randomUUID(),
            date,
            startsAt,
            endsAt,
            "OPENED",
            service,
            customerId,
            barberShopId,
            barberId,
        )
        return appointment
    }

    static with({
        id,
        date,
        service,
        barberId,
        barberShopId,
        customerId,
        startsAt,
        status
    }: IAppointmentWithProps) {
        const endsAt = startsAt.increment(service.timeInMinutes)

        const appointment = new Appointment(
            id,
            date,
            startsAt,
            endsAt,
            status,
            service,
            customerId,
            barberShopId,
            barberId,
        )
        return appointment
    }

}