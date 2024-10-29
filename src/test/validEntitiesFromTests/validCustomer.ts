import { Customer } from "../../domain/Entities/Customer";
import { CPF } from "../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../domain/valueObjects/Phone/Phone";

export const validCustomer = Customer.build({
    name: 'Diogo',
    cpf: new CPF('846.609.070-31'),
    phone: new Phone('61999999990')
})