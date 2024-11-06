import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type IncrementContractExpirationInputDTO = {
    barberShopId: string,
    months: number
}

type IncrementContractExpirationOutputDTO = {
    newContractExpirationDate: Date
}

export class IncrementContractExiprationUseCase implements IUseCase<IncrementContractExpirationInputDTO, IncrementContractExpirationOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository
    ) { }
    async execute({ barberShopId, months }: IncrementContractExpirationInputDTO): Promise<IncrementContractExpirationOutputDTO> {

        const barberShopFromRepository = await this.barberShopRepository.findById(barberShopId)
        if (!barberShopFromRepository) throw new Error('Estabelecimento não encontrado')

        if (isNaN(months) || months <= 0) throw new Error('Informe uma quantidade de meses válida')

        barberShopFromRepository.incrementContractExpirationByMonth(months)

        await this.barberShopRepository.update(barberShopFromRepository)

        return ({
            newContractExpirationDate: barberShopFromRepository.getContractExpirationDate()
        })
    }
}