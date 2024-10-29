
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";


interface IValidateManagerInputDTO {
    token: string
}

interface IValidateManagerOutputDTO {
    id: string
}

export class ValidateManagerUseCase implements IUseCase<IValidateManagerInputDTO, IValidateManagerOutputDTO> {

    constructor(
        private bearerToken: IBearerToken,
        private managerRepository: IManagerRepository
    ) { }

    async execute({ token }: IValidateManagerInputDTO): Promise<IValidateManagerOutputDTO> {

        try {
            const { payload, isValid } = await this.bearerToken.decodeToken(token)
            if (!isValid || payload.role != 'manager') throw new Error('Usuário não autorizado')

            const userFromDb = await this.managerRepository.findById(payload.id)
            if (!userFromDb) throw new Error('Usuário não autorizado')


            return ({
                id: payload.id
            })
        } catch (error) {
            throw new Error('Usuário não autorizado')
        }

    }
}