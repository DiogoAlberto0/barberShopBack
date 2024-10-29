
export type AddressPropsType = {
    zipCode: string;
    country: string,
    state: string,
    city: string,
    neighborhood: string,
    street: string,
    number: number,
    complement?: string,
}
export class Address {

    constructor(
        public readonly props: AddressPropsType
    ) {
        if (!this.validateZipCode(this.props.zipCode)) throw new Error('CEP inválido')

        this.props = {
            ...this.props,
            zipCode: this.cleanZipCode(this.props.zipCode)
        }
    }

    private cleanZipCode = (zipCode: string): string => {
        return zipCode.replace(/\D/g, '')
    }

    private validateZipCode = (zipCode: string): boolean => {
        const cleanedZipCode = this.cleanZipCode(zipCode)

        const regex = /^\d{8}$/;
        return regex.test(cleanedZipCode);
    }

    toFormattedString = () => {
        const { country, state, city, neighborhood, street, number } = this.props
        const complement = this.props.complement ? `, ${this.props.complement}` : ''
        return `${country}, ${state}, ${city}, ${neighborhood}, ${street}, ${number}${complement}`
    }
}