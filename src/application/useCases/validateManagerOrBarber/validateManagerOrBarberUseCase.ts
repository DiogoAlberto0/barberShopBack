import { IBarberRepository } from "../../interfaces/repository/barberRepository.interface";
import { IBearerToken } from "../../interfaces/authentication/bearerToken.interface";
import { IUseCase } from "../IUseCase.interface";
import { IManagerRepository } from "../../interfaces/repository/managerRepository.interface";
import { Manager } from "../../../domain/Entities/Manager";
import { Barber } from "../../../domain/Entities/Barber";


interface IValidateManagerOrBarberInputDTO {
    token: string
}

interface IValidateManagerOrBarberOutputDTO {
    id: string
}

export class ValidateManagerOrBarberUseCase implements IUseCase<IValidateManagerOrBarberInputDTO, IValidateManagerOrBarberOutputDTO> {

    constructor(
        private bearerToken: IBearerToken,
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({ token }: IValidateManagerOrBarberInputDTO): Promise<IValidateManagerOrBarberOutputDTO> {

        try {


            const { payload, isValid } = await this.bearerToken.decodeToken(token)

            if (!isValid) throw new Error('Usuário não autorizado')

            let userFromDb: Manager | Barber | undefined = undefined

            if (payload.role == 'barber') {
                userFromDb = await this.barberRepository.findById(payload.id)
            }

            if (payload.role == 'manager') {
                userFromDb = await this.managerRepository.findById(payload.id)
            }


            if (!userFromDb) throw new Error('Usuário não autorizado')


            return ({
                id: payload.id
            })
        } catch (error) {
            console.log(error)
            throw new Error('Usuário não autorizado')
        }

    }
}