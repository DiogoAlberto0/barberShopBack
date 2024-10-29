
import { Admin } from "../../../../domain/Entities/Admin";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { Password } from "../../../../domain/valueObjects/Password/Password";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { IAdminRepository } from "../../../interfaces/repository/adminRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

type ICreateAdminInputDTO = {
    name: string,
    cpf: string,
    password: string,
    phone: string
}

type ICreateAdminOutputDTO = {
    id: string
}

export class CreateAdminUseCase implements IUseCase<ICreateAdminInputDTO, ICreateAdminOutputDTO> {

    constructor(
        private adminRepository: IAdminRepository
    ) { }

    async execute({
        cpf,
        name,
        password,
        phone
    }: ICreateAdminInputDTO): Promise<ICreateAdminOutputDTO> {

        const cpfObj = new CPF(cpf)
        const phoneObj = new Phone(phone)
        const passwordObj = Password.create(password)


        const admin = Admin.build({
            name,
            cpf: cpfObj,
            phone: phoneObj,
            password: passwordObj,
        })

        if (await this.adminRepository.isCPFInUse(admin.cpf)) throw new Error('CPF já cadastrado')
        if (await this.adminRepository.isNameInUse(admin.name)) throw new Error('Nome já cadastrado')
        if (await this.adminRepository.isPhoneInUse(admin.phone)) throw new Error('Telefone já cadastrado')

        await this.adminRepository.create(admin)

        return ({
            id: admin.id
        })

    }
}