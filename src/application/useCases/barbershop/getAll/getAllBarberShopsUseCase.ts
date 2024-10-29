import { BarberShop } from "../../../../domain/Entities/BarberShop"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type getAllInputDTO = {
    page?: number,
    pageSize?: number,
    country?: string,
    state?: string,
    city?: string,
    neighborhood?: string,
}

type getAllOutputDTO = {
    barberShops: BarberShop[]
}

export class GetAllBarberShopUseCase implements IUseCase<getAllInputDTO, getAllOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository
    ) { }

    async execute(input: getAllInputDTO): Promise<getAllOutputDTO> {

        let barberShops: BarberShop[]


        try {

            const {
                page,
                pageSize,
                city,
                country,
                neighborhood,
                state
            } = input


            if (page && page < 0 || pageSize && pageSize < 0) throw new Error('O numero da página e o tamanho devem ser positivos')
            if (page && isNaN(page) || pageSize && isNaN(pageSize)) throw new Error('Os valores para a paginação devem ser numéricos')

            const skip = page && pageSize ? page * (pageSize - 1) : undefined

            barberShops = await this.barberShopRepository.list({
                skip,
                limit: pageSize,
                city,
                country,
                neighborhood,
                state
            })

            return ({
                barberShops
            })

        } catch (error: any) {
            throw new Error('Erro ao buscar as barbearias: ' + error.message)
        }
    }
}
