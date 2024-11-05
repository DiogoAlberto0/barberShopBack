import { IUseCase } from "../../IUseCase.interface";
import { IPaymentRepository } from "../../../interfaces/payment/paymentRepository.interface";
import { IPreferenceRepository } from "../../../interfaces/repository/preferenceRepository.interface";


interface IValidatePaymentInputDTO {
    paymentId: string
}

interface IValidatePaymentOutputDTO {
    barberShopId: string,
    months: number,
    isApproved: boolean
}


export class ValidatePaymentUseCase implements IUseCase<IValidatePaymentInputDTO, IValidatePaymentOutputDTO> {

    constructor(
        private paymentRepository: IPaymentRepository,
        private preferenceRepository: IPreferenceRepository
    ) { }

    async execute({ paymentId }: IValidatePaymentInputDTO): Promise<IValidatePaymentOutputDTO> {

        const { products, createdAt, isApproved } = await this.paymentRepository.verifyIfPaymentIsApprovedOrRejected(paymentId)
        const item = products[0]

        const preference = await this.preferenceRepository.findLastBy({
            barberShopId: item.id,
            createdAt,
            price: item.price,
            quantity: item.quantity,
            title: item.title,
        })
        if (!preference) throw new Error('Falha ao processar pagamento')

        isApproved ? preference.setApprovedStatus() : preference.setRejectedStatus()

        await this.preferenceRepository.update(preference)

        return ({
            barberShopId: preference.barberShopId,
            months: item.quantity,
            isApproved
        })


    }

}