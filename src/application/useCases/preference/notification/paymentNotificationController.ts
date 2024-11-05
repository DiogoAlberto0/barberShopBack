import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { ValidatePaymentUseCase } from "./validatePaymentUseCase";
import { IncrementContractExiprationUseCase } from '../../barbershop/incrementContractExpiration/incrementContractExpirationUseCase';


export class PaymentNotificationController implements IController {

    constructor(
        private validatePaymentUseCase: ValidatePaymentUseCase,
        private incrementContractExiprationUseCase: IncrementContractExiprationUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { type, data } = req.body

            // if (!data) throw new Error('Invalid event')

            // if (!data.id) throw new Error('Invalid event')

            switch (type) {
                case 'payment':
                    // const { barberShopId, months, isApproved } = await this.validatePaymentUseCase.execute({ paymentId: data.id })

                    // if (isApproved) {
                    //     await this.incrementContractExiprationUseCase.execute({
                    //         barberShopId,
                    //         months
                    //     })
                    // }

                    console.log(req.body)
                    res.status(200).send()
                default:
                    res.status(200).send()
            }
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    };
}