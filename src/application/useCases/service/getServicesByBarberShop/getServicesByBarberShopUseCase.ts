import { Service } from "../../../../domain/Entities/Service"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IServiceRepository } from "../../../interfaces/repository/servicesRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type IGetServicesByBarberShopInputDTO = {
    barberShopId: string
}

type IGetServicesBuBarberShopOutputDTO = {
    services: Service[]
}

export class GetServicesByBarberShopUseCase implements IUseCase<IGetServicesByBarberShopInputDTO, IGetServicesBuBarberShopOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository,
        private serviceRepository: IServiceRepository
    ) { }
    async execute({ barberShopId }: IGetServicesByBarberShopInputDTO): Promise<IGetServicesBuBarberShopOutputDTO> {

        if (!barberShopId) throw new Error('O ID da barbearia é obrigatório')

        const barberShopFromDb = await this.barberShopRepository.findById(barberShopId)
        if (!barberShopFromDb) throw new Error('Estabelecimento não encontrado')

        const services = await this.serviceRepository.findByBarberShop(barberShopId)

        return ({
            services
        })
    }

}