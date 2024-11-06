
import { randomUUID } from 'node:crypto';

type IPreferenceStatus = 'CANCELED' | 'APPROVED' | 'REJECTED' | 'PENDING'
const allStatus = ['CANCELED', 'APPROVED', 'REJECTED', 'PENDING']

type IPreferenceBuildProps = {
    title: string
    barberShopId: string
    date: Date
    quantity: number
    unitPrice: number
    status: IPreferenceStatus
}

type IPreferenceWithProps = {
    id: string
    title: string
    barberShopId: string
    date: Date
    quantity: number
    unitPrice: number
    status: IPreferenceStatus
}
export class Preference {



    private constructor(
        public id: string,
        public title: string,
        public barberShopId: string,
        public date: Date,
        public quantity: number,
        public unitPrice: number,
        public status: IPreferenceStatus,
        public totalPrice: number
    ) {
        if (quantity <= 0) throw new Error('A quantidade deve ser maior que zero')
        if (!allStatus.find((value) => value == this.status)) throw new Error('Status inválido')
    }

    static build({
        barberShopId,
        title,
        date,
        quantity,
        status,
        unitPrice
    }: IPreferenceBuildProps) {
        return new Preference(
            randomUUID(),
            title,
            barberShopId,
            date,
            quantity,
            unitPrice,
            status,
            unitPrice * quantity
        );
    }

    static with({
        id,
        title,
        barberShopId,
        date,
        quantity,
        status,
        unitPrice
    }: IPreferenceWithProps) {
        const preference = new Preference(
            id,
            title,
            barberShopId,
            date,
            quantity,
            unitPrice,
            status,
            unitPrice * quantity
        )
        return preference
    }

    public setApprovedStatus() {
        this.status = 'APPROVED'
    }

    public setRejectedStatus() {
        this.status = 'REJECTED'
    }
}