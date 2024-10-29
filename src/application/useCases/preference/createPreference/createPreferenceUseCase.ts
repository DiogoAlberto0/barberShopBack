import { IUseCase } from "../../IUseCase.interface";
import { IPaymentRepository, IProduct } from "../../../interfaces/payment/paymentRepository.interface";
import { IPreferenceRepository } from "../../../interfaces/repository/preferenceRepository.interface";
import { Preference } from "../../../../domain/Entities/Preference";
import { randomUUID } from "crypto";
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface";
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";

interface ICreatePreferenceInputDTO {
    barberShopId: string,
    managerId: string,
    quantity: number
}

interface ICreatePreferenceOutputDTO {
    preferenceId: string,
    paymentUrl: string
}
export class CreatePreferenceUseCase implements IUseCase<ICreatePreferenceInputDTO, ICreatePreferenceOutputDTO> {

    constructor(
        private paymentRepository: IPaymentRepository,
        private preferenceRepository: IPreferenceRepository,
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute({ barberShopId, managerId, quantity }: ICreatePreferenceInputDTO): Promise<ICreatePreferenceOutputDTO> {


        const barberShop = await this.barberShopRepository.findById(barberShopId)
        if (!barberShop) throw new Error('Estabelecimento não encontrado')

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        if (barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        const productPrice = Number(process.env.PRODUCT_PRICE);
        if (isNaN(productPrice) || productPrice <= 0) {
            throw new Error('Produto ou preço inválido nas configurações do sistema');
        }

        const preference = Preference.build({
            title: process.env.PRODUCT_NAME || 'Incremento de contrato',
            barberShopId,
            date: new Date(),
            quantity,
            status: 'PENDING',
            price: productPrice
        })

        const products: IProduct[] = [
            {
                id: barberShop.id,
                title: preference.title,
                quantity: preference.quantity,
                price: preference.price
            }
        ]

        const { paymentUrl, preferenceId } = await this.paymentRepository.createPreference(products)

        preference.setPreferenceId(preferenceId)

        await this.preferenceRepository.save(preference)

        return ({
            preferenceId,
            paymentUrl
        })
    }
}