import MercadoPagoConfig, { Payment, Preference } from "mercadopago";
import { IPaymentRepository, IPreferenceResponseData, IProduct } from "../../application/interfaces/payment/paymentRepository.interface";


export class MercadoPagoPaymentRepository implements IPaymentRepository {

    private client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' })

    createPreference = async (products: IProduct[]): Promise<IPreferenceResponseData> => {

        const preferenceService = new Preference(this.client)


        const preference = await preferenceService.create({
            body: {
                items: products.map(product => ({
                    id: product.id,
                    title: product.title,
                    quantity: product.quantity,
                    unit_price: product.price
                })),
                back_urls: {
                    success: `${process.env.FRONTEND_BASE_URL}/`,
                    failure: `${process.env.FRONTEND_BASE_URL}/`
                },
                auto_return: 'approved',
                notification_url: `${process.env.PAYMENT_NOTIFICATION_URL}`,
            }
        })

        if (!preference.init_point || !preference.id) throw new Error('Falha ao criar preferência de pagamento')

        return ({
            preferenceId: preference.id,
            paymentUrl: preference.init_point,
        })
    }

    async verifyIfPaymentIsApprovedOrRejected(paymentId: string): Promise<{ products: IProduct[], createdAt: Date, isApproved: boolean }> {

        const paymentService = new Payment(this.client)

        const payment = await paymentService.get({ id: paymentId })

        if (payment.status != 'approved' && payment.status != 'rejected') throw new Error('Pagamento não aprovado')
        const isApproved = payment.status == 'approved'

        if (!payment.date_created) throw new Error('Pagamento inválido')
        const createdAt = new Date(payment.date_created)


        const items = payment.additional_info?.items

        const products = items?.map(item => ({
            id: item.id,
            price: item.unit_price,
            quantity: item.quantity,
            title: item.title
        })) || []

        return ({
            createdAt,
            isApproved,
            products
        })
    }

}