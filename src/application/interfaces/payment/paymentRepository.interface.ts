
export interface IProduct {
    id: string,
    title: string;
    quantity: number;
    price: number;
}

export interface IPreferenceResponseData {
    preferenceId: string,
    paymentUrl: string
}

export interface IPaymentRepository {
    createPreference(products: IProduct[]): Promise<IPreferenceResponseData>;
    verifyIfPaymentIsApprovedOrRejected(paymentId: string): Promise<{ products: IProduct[], createdAt: Date, isApproved: boolean }>
}