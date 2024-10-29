import { vi } from "vitest";
import { IPaymentRepository } from "../../../application/interfaces/payment/paymentRepository.interface";


export const mockPaymentRepository: IPaymentRepository = {
    createPreference: vi.fn(),
    verifyIfPaymentIsApprovedOrRejected: vi.fn()
}