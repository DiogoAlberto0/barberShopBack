
import { Barber } from "../../../../domain/Entities/Barber"
import { IBearerToken } from "../../../interfaces/authentication/bearerToken.interface"
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type IGetBarbersByBarberShopInputDTO = {
    managerToken?: string,
    barberShopId: string,
}

type IGetBarbersByBarberShopOutputDTO = {
    barbers: Barber[]
}

export class GetBarbersByBarberShopUseCase implements IUseCase<IGetBarbersByBarberShopInputDTO, IGetBarbersByBarberShopOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository,
        private barberShopRepository: IBarberShopRepository,
        private tokenRepository: IBearerToken
    ) { }
    async execute({ managerToken, barberShopId }: IGetBarbersByBarberShopInputDTO): Promise<IGetBarbersByBarberShopOutputDTO> {

        let barbers: Barber[]

        if (managerToken) {

            const { payload } = await this.tokenRepository.decodeToken(managerToken)
            const managerId = payload.id

            const manager = await this.managerRepository.findById(managerId)

            const barberShop = await this.barberShopRepository.findById(barberShopId)

            if (!manager || !barberShop || barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

            barbers = await this.barberRepository.getBarbersByBarberShop(barberShopId, false)

        } else {
            barbers = await this.barberRepository.getBarbersByBarberShop(barberShopId, true)
        }

        return ({
            barbers
        })


    }

}