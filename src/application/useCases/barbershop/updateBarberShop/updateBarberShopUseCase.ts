import { json } from "stream/consumers"
import { BarberShop } from "../../../../domain/Entities/BarberShop"
import { Address } from "../../../../domain/valueObjects/Address/Address"
import { Phone } from "../../../../domain/valueObjects/Phone/Phone"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../IUseCase.interface"

type UpdateBarberShopInputDTO = {
    managerId: string,
    barberShopId: string,
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
}
type UpdateBarberShopOutputDTO = void

export class UpdateBarberShopUseCase implements IUseCase<UpdateBarberShopInputDTO, UpdateBarberShopOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({ managerId, barberShopId, name, phone, address }: UpdateBarberShopInputDTO): Promise<UpdateBarberShopOutputDTO> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const barberShopFromRepository = await this.barberShopRepository.findById(barberShopId)
        if (!barberShopFromRepository) throw new Error('Estabelecimento não encontrado')

        if (barberShopFromRepository.managerId != manager.id) throw new Error('Usuário não autorizado')

        const phoneObj = new Phone(phone)
        const addressObj = new Address(address)

        await this.checkForDuplicateName(name, barberShopFromRepository.id)
        await this.checkForDuplicatePhone(phoneObj, barberShopFromRepository.id)
        await this.checkForDuplicateAddress(addressObj, barberShopFromRepository)

        const contractExpiration = barberShopFromRepository.getContractExpirationDate()
        const invalidContractExpiration = new Date(barberShopFromRepository.getContractExpirationDate())
        invalidContractExpiration.setMonth(contractExpiration.getMonth() + 1)
        if (invalidContractExpiration < new Date()) throw new Error('Seu contrato expirou favor contatar o admin')

        const barberShop = BarberShop.with({
            id: barberShopFromRepository.id,
            name,
            phone: phoneObj,
            address: addressObj,
            barberLimit: barberShopFromRepository.getBarberLimit(),
            contractExpirationDate: barberShopFromRepository.getContractExpirationDate(),
            holidays: barberShopFromRepository.holidays,
            managerId: barberShopFromRepository.getManagerId(),
            operation: barberShopFromRepository.getOperation()
        })


        await this.barberShopRepository.update(barberShop)

    }

    private async checkForDuplicateName(name: string, currentId: string): Promise<void> {
        const existentBarberShopName = await this.barberShopRepository.findByName(name);
        if (existentBarberShopName && existentBarberShopName.id !== currentId) {
            throw new Error('Nome do estabelecimento já está em uso')
        }
    }

    private async checkForDuplicatePhone(phone: Phone, currentId: string): Promise<void> {
        const existentBarberShopPhone = await this.barberShopRepository.findByPhone(phone);
        if (existentBarberShopPhone && existentBarberShopPhone.id !== currentId) {
            throw new Error('Telefone do estabelecimento já está em uso')
        }
    }

    private async checkForDuplicateAddress(address: Address, barberShopFromDB: BarberShop): Promise<void> {

        const isEqualAddress = JSON.stringify(address.props) == JSON.stringify(barberShopFromDB.address.props)

        const existentBarberShopAddress = await this.barberShopRepository.isAddressInUse(address);
        if (existentBarberShopAddress && !isEqualAddress) {
            throw new Error('Endereço já está em uso')
        }
    }
}