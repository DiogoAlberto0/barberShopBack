//entities
import { BarberShop } from "../../../../domain/Entities/BarberShop";

//value objects
import { Address } from "../../../../domain/valueObjects/Address/Address";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";

//contracts
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

type CreateBarberShopInputDTO = {
    name: string,
    phone: string,
    address: {
        zipCode: string;
        country: string,
        state: string,
        city: string,
        neighborhood: string,
        street: string,
        number: number,
        complement?: string,
    }

    contractExpirationDate: Date,
    managerId: string
}

type CreateBarberShopOutputDTO = {
    id: string
}


export class CreateBarberShopUseCase implements IUseCase<CreateBarberShopInputDTO, CreateBarberShopOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({
        name,
        phone,
        address,
        contractExpirationDate,
        managerId
    }: CreateBarberShopInputDTO): Promise<CreateBarberShopOutputDTO> {

        const phoneObj = new Phone(phone)
        const addressObj = new Address(address)

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Gerente não encontrado')

        const existsBarberShopByPhone = await this.barberShopRepository.findByPhone(phoneObj)
        if (existsBarberShopByPhone) throw new Error('Telefone já está em uso')

        const existsBarberShopByAddress = await this.barberShopRepository.isAddressInUse(addressObj)
        if (existsBarberShopByAddress) throw new Error('Endereço já está em uso')

        if (contractExpirationDate.getTime() < new Date().getTime()) throw new Error('A data da expiração de contrato deve ser anterior a data atual')

        const barberShop = BarberShop.build({
            name,
            phone: phoneObj,
            address: new Address(address),
            contractExpirationDate,
            managerId: manager.id
        })

        await this.barberShopRepository.create(barberShop)

        return ({
            id: barberShop.id
        })
    }

}