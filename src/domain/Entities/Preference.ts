
import { DayOff } from './DayOff';

type IPreferenceStatus = 'CANCELED' | 'APPROVED' | 'REJECTED' | 'PENDING'
const allStatus = ['CANCELED', 'APPROVED', 'REJECTED', 'PENDING']

type IPreferenceBuildProps = {
    title: string
    barberShopId: string
    date: Date
    quantity: number
    price: number
    status: IPreferenceStatus
}

type IPreferenceWithProps = {
    id: string
    title: string
    barberShopId: string
    date: Date
    quantity: number
    price: number
    status: IPreferenceStatus
}
export class Preference {

    public id: string = ''

    private constructor(
        public title: string,
        public barberShopId: string,
        public date: Date,
        public quantity: number,
        public price: number,
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
        price
    }: IPreferenceBuildProps) {
        return new Preference(
            title,
            barberShopId,
            date,
            quantity,
            price,
            status,
            price * quantity
        );
    }

    static with({
        id,
        title,
        barberShopId,
        date,
        quantity,
        status,
        price
    }: IPreferenceWithProps) {
        const preference = new Preference(
            title,
            barberShopId,
            date,
            quantity,
            price,
            status,
            price * quantity
        )
        preference.setPreferenceId(id);
        return preference
    }

    public setPreferenceId(preferenceId: string) {
        this.id = preferenceId
    }

    public setApprovedStatus() {
        this.status = 'APPROVED'
    }

    public setRejectedStatus() {
        this.status = 'REJECTED'
    }
}