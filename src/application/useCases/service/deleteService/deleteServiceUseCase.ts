
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IServiceRepository } from "../../../interfaces/repository/servicesRepository.interface"
import { IUseCase } from "../../IUseCase.interface"



type IDeleteServiceInputDTO = {
    serviceId: string,
    managerId: string
}

type IDeleteServiceOutputDTO = void

export class DeleteServiceUseCase implements IUseCase<IDeleteServiceInputDTO, IDeleteServiceOutputDTO> {

    constructor(
        private serviceRepository: IServiceRepository,
        private managerRepository: IManagerRepository,
        private barberShopRepository: IBarberShopRepository
    ) { }
    async execute({ serviceId, managerId }: IDeleteServiceInputDTO): Promise<IDeleteServiceOutputDTO> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        if (!serviceId) throw new Error('O ID do serviço é obrigatório')

        const serviceFromDb = await this.serviceRepository.findById(serviceId)
        if (!serviceFromDb) throw new Error('Serviço não cadastrado')

        const barberShop = await this.barberShopRepository.findById(serviceFromDb.barberShopId)
        if (!barberShop) throw new Error('Usuário não autorizado')
        if (barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')


        await this.serviceRepository.delete(serviceFromDb.id)

    }
}