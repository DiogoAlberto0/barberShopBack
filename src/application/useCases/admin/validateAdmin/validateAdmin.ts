
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface";
import { IAdminRepository } from "../../../interfaces/repository/adminRepository.interface";
import { IUseCase } from "../../IUseCase.interface";


interface IValidateAdminInputDTO {
    token: string
}

interface IValidateAdminOutputDTO {
    id: string
}

export class ValidateAdminUseCase implements IUseCase<IValidateAdminInputDTO, IValidateAdminOutputDTO> {

    constructor(
        private bearerToken: IBearerToken,
        private adminRepository: IAdminRepository
    ) { }

    async execute({ token }: IValidateAdminInputDTO): Promise<IValidateAdminOutputDTO> {

        try {
            const { payload, isValid } = await this.bearerToken.decodeToken(token)
            if (!isValid || payload.role != 'admin') throw new Error('Usuário não autorizado')

            const userFromDb = await this.adminRepository.findById(payload.id)
            if (!userFromDb) throw new Error('Usuário não autorizado')


            return ({
                id: payload.id
            })
        } catch (error) {
            throw new Error('Usuário não autorizado')
        }

    }
}