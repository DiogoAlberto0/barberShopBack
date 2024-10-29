//contracts
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

//entities
import { Manager } from "../../../../domain/Entities/Manager";

//value objects
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { Password } from "../../../../domain/valueObjects/Password/Password";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";



export type UpdateManagerInputDTO = {
    id: string,
    name: string,
    phone: string,
    cpf: string,
    password: string
}

export type UpdateManagerOutputDTO = void

export class UpdateManagerUseCase implements IUseCase<UpdateManagerInputDTO, UpdateManagerOutputDTO> {


    constructor(
        private managerRepository: IManagerRepository
    ) { }

    execute = async ({
        id,
        name,
        cpf,
        phone,
        password
    }: UpdateManagerInputDTO) => {

        const currentManager = await this.managerRepository.findById(id)
        if (!currentManager) throw new Error('Usuário não encontrado')

        const phoneObj = new Phone(phone)
        const cpfObj = new CPF(cpf)

        if (
            currentManager.name != name &&
            await this.managerRepository.isNameInUse(name)
        ) throw new Error('Nome já cadastrado')

        if (
            currentManager.cpf.cleaned != cpfObj.cleaned &&
            await this.managerRepository.isCPFInUse(cpfObj)
        ) throw new Error('CPF já cadastrado')


        if (
            currentManager.phone.phoneNumber != phoneObj.phoneNumber &&
            await this.managerRepository.isPhoneInUse(phoneObj)
        ) throw new Error('Telefone já cadastrado')

        const manager = Manager.with({
            id,
            name,
            phone: new Phone(phone),
            cpf: new CPF(cpf),
            password: password ? Password.create(password) : Password.withHash(currentManager.password.getHash())
        })

        await this.managerRepository.update(manager)
    }
}