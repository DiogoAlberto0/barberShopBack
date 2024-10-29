import { BarberShop } from "../../../../domain/Entities/BarberShop"
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type IUpdateBarberLimitInputDTO = {
    barberShopId: string,
    newLimit: number
}

type IUpdateBarberLimitOutputDTO = void

export class UpdateBarberLimitUseCase implements IUseCase<IUpdateBarberLimitInputDTO, IUpdateBarberLimitOutputDTO> {


    constructor(
        private barberShopRepository: IBarberShopRepository,
        private barberRepository: IBarberRepository
    ) { }
    async execute({ barberShopId, newLimit }: IUpdateBarberLimitInputDTO): Promise<IUpdateBarberLimitOutputDTO> {

        const barberShopFromRepository = await this.barberShopRepository.findById(barberShopId)
        if (!barberShopFromRepository) throw new Error('Estabelecimento não encontrado')

        const barberQuantity = await this.barberRepository.countBarbersFromBarberShop(barberShopId)
        if (newLimit < barberQuantity) throw new Error('O novo limite é menor que a quantidade de funcionários existente')

        barberShopFromRepository.updateBarberLimit(newLimit)

        await this.barberShopRepository.update(barberShopFromRepository)
    }

}