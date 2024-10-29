
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

interface IManagerSigninInputDTO {
    phone: string
    password: string
}

interface IManagerSigninOutputDTO {
    token: string
}

export class SigninManagerUseCase implements IUseCase<IManagerSigninInputDTO, IManagerSigninOutputDTO> {

    constructor(
        private managerRepository: IManagerRepository,
        private bearerToken: IBearerToken
    ) { }
    async execute(input: IManagerSigninInputDTO): Promise<IManagerSigninOutputDTO> {

        const phone = new Phone(input.phone)
        const password = input.password

        const user = await this.managerRepository.findByPhone(phone)
        if (!user) throw new Error('Telefone ou senha inválidos')

        const isCorrectPass = user.password.compare(password)
        if (!isCorrectPass) throw new Error('Telefone ou senha inválidos')

        const { token } = await this.bearerToken.generateToken({ id: user.id, role: 'manager' })

        return ({
            token
        })
    }
}