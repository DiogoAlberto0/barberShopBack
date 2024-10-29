import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface";
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface";
import { IUseCase } from "../../IUseCase.interface";


interface IValidateBarberInputDTO {
    token: string
}

interface IValidateBarberOutputDTO {
    id: string
}

export class ValidateBarberUseCase implements IUseCase<IValidateBarberInputDTO, IValidateBarberOutputDTO> {

    constructor(
        private bearerToken: IBearerToken,
        private barberRepository: IBarberRepository
    ) { }

    async execute({ token }: IValidateBarberInputDTO): Promise<IValidateBarberOutputDTO> {

        try {
            const { payload, isValid } = await this.bearerToken.decodeToken(token)
            if (!isValid || payload.role != 'barber') throw new Error('Usuário não autorizado')

            const userFromDb = await this.barberRepository.findById(payload.id)
            if (!userFromDb) throw new Error('Usuário não autorizado')


            return ({
                id: payload.id
            })
        } catch (error) {
            throw new Error('Usuário não autorizado')
        }

    }
}