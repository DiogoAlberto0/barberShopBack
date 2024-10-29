import { Service } from "../../../../domain/Entities/Service"
import { Price } from "../../../../domain/valueObjects/Price/Price"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IServiceRepository } from "../../../interfaces/repository/servicesRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type ICreateNewServiceInputDTO = {
    managerId: string,
    barberShopId: string,
    name: string,
    description: string,
    price: number,
    timeInMinutes: number
}

type ICreateNewServiceOutputDTO = void

export class CreateNewServiceUseCase implements IUseCase<ICreateNewServiceInputDTO, ICreateNewServiceOutputDTO> {

    constructor(
        private serviceRepository: IServiceRepository,
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }
    async execute({
        name,
        description,
        price,
        timeInMinutes,
        barberShopId,
        managerId
    }: ICreateNewServiceInputDTO): Promise<ICreateNewServiceOutputDTO> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const barberShopFromRepository = await this.barberShopRepository.findById(barberShopId)
        if (!barberShopFromRepository) throw new Error('Estabelecimento não encontrado')

        if (barberShopFromRepository.managerId != manager.id) throw new Error('Usuário não autorizado')


        const existentService = await this.serviceRepository.findByNameAndBarberShop(name, barberShopId)
        if (existentService) throw new Error('Serviço já cadastrado')


        const contractExpiration = barberShopFromRepository.getContractExpirationDate()
        const invalidContractExpiration = new Date(barberShopFromRepository.getContractExpirationDate())
        invalidContractExpiration.setMonth(contractExpiration.getMonth() + 1)
        if (invalidContractExpiration < new Date()) throw new Error('Seu contrato expirou, favor contatar o ADM')

        const newService = Service.build({
            name,
            description,
            price: new Price(price),
            timeInMinutes,
            barberShopId
        })

        await this.serviceRepository.create(newService)
    }
}