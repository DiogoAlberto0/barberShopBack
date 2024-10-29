import { Service } from "../../../../domain/Entities/Service"
import { Price } from "../../../../domain/valueObjects/Price/Price"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IServiceRepository } from "../../../interfaces/repository/servicesRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type IUpdateServiceInputDTO = {
    managerId: string,
    serviceId: string,
    name?: string,
    description?: string,
    price?: number,
    timeInMinutes?: number
}

type IUpdateServiceOutputDTO = void

export class UpdateServiceUseCase implements IUseCase<IUpdateServiceInputDTO, IUpdateServiceOutputDTO> {


    constructor(
        private serviceRepository: IServiceRepository,
        private managerRepository: IManagerRepository,
        private barberShopRepository: IBarberShopRepository
    ) { }

    async execute({ managerId, serviceId, name, description, price, timeInMinutes }: IUpdateServiceInputDTO): Promise<IUpdateServiceOutputDTO> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')


        if (!serviceId) throw new Error('O ID do serviço é obrigatório.')
        const serviceFromDb = await this.serviceRepository.findById(serviceId)
        if (!serviceFromDb) throw new Error('Serviço não cadastrado')

        const barberShop = await this.barberShopRepository.findById(serviceFromDb.barberShopId)
        if (!barberShop || barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        if (name) {
            const existentName = await this.serviceRepository.findByNameAndBarberShop(name, serviceFromDb.barberShopId)
            if (existentName) throw new Error('Serviço com o mesmo nome já cadastrado')
        }

        const updatedService = Service.with({
            id: serviceId,
            barberShopId: serviceFromDb.barberShopId,
            name: name !== undefined ? name : serviceFromDb.name,
            description: description !== undefined ? description : serviceFromDb.description,
            price: price !== undefined ? new Price(price) : serviceFromDb.price,
            timeInMinutes: timeInMinutes !== undefined ? timeInMinutes : serviceFromDb.timeInMinutes,
        })

        await this.serviceRepository.update(updatedService)
    }

}