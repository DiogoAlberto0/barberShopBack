import { Manager } from "../../../../domain/Entities/Manager";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { Password } from "../../../../domain/valueObjects/Password/Password";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

export type CreateManagerInputDTO = {
    name: string,
    cpf: string,
    phone: string,
    password: string,
}

export type CreateManagerOutputDTO = {
    id: string
}

export class CreateManagerUseCase implements IUseCase<CreateManagerInputDTO, CreateManagerOutputDTO> {

    constructor(
        private managerRepository: IManagerRepository
    ) { }

    execute = async ({ name, cpf, phone, password }: CreateManagerInputDTO): Promise<CreateManagerOutputDTO> => {

        const nameObj = name
        const phoneObj = new Phone(phone)
        const cpfObj = new CPF(cpf)
        const passwordObj = Password.create(password)


        const manager = Manager.build({
            name: nameObj,
            cpf: cpfObj,
            phone: phoneObj,
            password: passwordObj
        })

        if (await this.managerRepository.isNameInUse(manager.name)) throw new Error('Nome já cadastrado')
        if (await this.managerRepository.isPhoneInUse(manager.phone)) throw new Error('Telefone já cadastrado')
        if (await this.managerRepository.isCPFInUse(manager.cpf)) throw new Error('CPF já cadastrado')

        await this.managerRepository.create(manager)

        return ({
            id: manager.id
        })
    }
}