import { Manager } from "../../../domain/Entities/Manager"
import { CPF } from "../../../domain/valueObjects/CPF/CPF"
import { Phone } from "../../../domain/valueObjects/Phone/Phone"


export interface IManagerRepository {
    create(manager: Manager): Promise<void>
    update(manager: Manager): Promise<void>
    findById(id: string): Promise<Manager | undefined>
    findByName(name: string): Promise<Manager | undefined>
    findByPhone(phone: Phone): Promise<Manager | undefined>
    findByCPF(cpf: CPF): Promise<Manager | undefined>
    list(options?: { skip: number, limit: number }): Promise<Manager[]>
    delete(id: string): Promise<void>
    count(): Promise<number>
    isNameInUse(name: string): Promise<boolean>
    isPhoneInUse(phone: Phone): Promise<boolean>
    isCPFInUse(cpf: CPF): Promise<boolean>
}