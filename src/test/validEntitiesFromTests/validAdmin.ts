import { Admin } from "../../domain/Entities/Admin";
import { CPF } from "../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../domain/valueObjects/Phone/Phone";
import { validPasswordObj } from "./validEntitiesFromTests";


export const validAdmin = Admin.build({
    name: 'Diogo',
    password: validPasswordObj,
    cpf: new CPF('064.828.580-40'),
    phone: new Phone('61999999999')
})

export const validAdmin2 = Admin.build({
    name: 'Diogo 2',
    password: validPasswordObj,
    cpf: new CPF('132.459.060-21'),
    phone: new Phone('61999999998')
})