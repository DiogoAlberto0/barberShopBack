


export class Phone {

    constructor(
        public readonly phoneNumber: string,
        public readonly countryCode: number = 55,
    ) {
        if (typeof this.phoneNumber != 'string') throw new Error('Telefone inválido')
        if (!this.isValid()) throw new Error('Telefone inválido')

        const cleaned = this.clean()
        this.phoneNumber = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned
    }

    private clean = (): string => {
        return this.phoneNumber.replace(/\D/g, '');
    }

    public isValid = (): boolean => {
        const cleaned = this.clean();
        const regex = /^\d{10,11}$/;
        return regex.test(cleaned);
    }
    public format = (): string => {

        const phone = this.phoneNumber

        if (phone.length === 11) {
            return `+${this.countryCode} (${phone.slice(0, 2)})${phone.slice(2, 7)}-${phone.slice(7)}`
        } else {
            return `+${this.countryCode} (${phone.slice(0, 2)})${phone.slice(2, 6)}-${phone.slice(6)}`
        }
    }
}