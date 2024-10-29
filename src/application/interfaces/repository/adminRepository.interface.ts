import { Admin } from "../../../domain/Entities/Admin";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";


export interface IAdminRepository {
    create(admin: Admin): Promise<void>;
    findById(adminId: string): Promise<Admin | undefined>;
    findByPhone(phone: Phone): Promise<Admin | undefined>;
    isNameInUse(name: string): Promise<boolean>;
    isCPFInUse(cpf: CPF): Promise<boolean>;
    isPhoneInUse(phone: Phone): Promise<boolean>;

}