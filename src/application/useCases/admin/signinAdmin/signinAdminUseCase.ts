import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface";
import { IAdminRepository } from "../../../interfaces/repository/adminRepository.interface";
import { IUseCase } from "../../IUseCase.interface";


type ISigninAdminInputDTO = {
    phone: string,
    password: string
}

type ISigninAdminOutputDTO = {
    token: string
}

export class SigninAdminUseCase implements IUseCase<ISigninAdminInputDTO, ISigninAdminOutputDTO> {

    constructor(
        private adminRepository: IAdminRepository,
        private bearerTokenRepository: IBearerToken
    ) { }

    async execute({ phone, password }: ISigninAdminInputDTO): Promise<ISigninAdminOutputDTO> {

        const phoneObj = new Phone(phone)

        const admin = await this.adminRepository.findByPhone(phoneObj)
        if (!admin) throw new Error('Telefone ou senha inválidos')

        const isCorrectPassword = admin.password.compare(password)
        if (!isCorrectPassword) throw new Error('Telefone ou senha inválidos')

        const payload = {
            id: admin.id,
            role: 'admin'
        }

        const { token } = await this.bearerTokenRepository.generateToken(payload)

        return ({
            token
        })
    }

}