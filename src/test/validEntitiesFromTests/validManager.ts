import { Manager } from "../../domain/Entities/Manager";
import { CPF } from "../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../domain/valueObjects/Phone/Phone";
import { validPasswordObj } from "./validEntitiesFromTests";


export const validManager = Manager.build({
    name: 'Diogo',
    password: validPasswordObj,
    cpf: new CPF('332.714.710-88'),
    phone: new Phone('61999999997')
})

export const validManager2 = Manager.build({
    name: 'Diogo 2',
    password: validPasswordObj,
    cpf: new CPF('010.189.940-84'),
    phone: new Phone('61999999996')
})
