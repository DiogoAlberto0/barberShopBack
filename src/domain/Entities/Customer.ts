import { randomUUID } from "node:crypto";
import { CPF } from "../valueObjects/CPF/CPF";
import { Phone } from "../valueObjects/Phone/Phone";

type IBuildCustomerProps = {
    name: string,
    phone: Phone,
    cpf: CPF
}
type IWithCustomerProps = {
    id: string,
    name: string,
    phone: Phone,
    cpf: CPF
}
export class Customer {


    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly phone: Phone,
        public readonly cpf: CPF,
    ) { }

    static build(
        {
            name,
            cpf,
            phone
        }: IBuildCustomerProps
    ) {
        return new Customer(
            randomUUID(),
            name,
            phone,
            cpf
        )
    }

    static with(
        {
            id,
            name,
            cpf,
            phone
        }: IWithCustomerProps
    ) {
        return new Customer(
            id,
            name,
            phone,
            cpf
        )
    }

}