import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { ValidatePaymentUseCase } from "./validatePaymentUseCase";
import { mockPaymentRepository } from "../../../../test/unit/vitestMockRepositories/mockPaymentRepository";
import { mockPreferenceRepository } from "../../../../test/unit/vitestMockRepositories/mockPreferenceRepository";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { Preference } from "../../../../domain/Entities/Preference";

const validatePaymentUseCase = new ValidatePaymentUseCase(mockPaymentRepository, mockPreferenceRepository)

const validPreference = Preference.build({
    barberShopId: validBarberShop.id,
    title: 'incremento contrato',
    price: 30,
    quantity: 1,
    date: new Date(),
    status: 'PENDING'
})

describe('validate payment use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();

        validPreference.status = 'PENDING'
    })

    it('should return barber shop id and monts', async () => {
        (mockPaymentRepository.verifyIfPaymentIsApprovedOrRejected as Mock).mockResolvedValue({
            products: [
                { id: validBarberShop.id, title: 'incremento contrato', quantity: 1, price: 30 }
            ],
            createdAt: new Date(),
            isApproved: true
        });
        (mockPreferenceRepository.findLastBy as Mock).mockResolvedValue(validPreference);

        const response = await validatePaymentUseCase.execute({ paymentId: '123' })

        expect(response).toStrictEqual({
            barberShopId: validBarberShop.id,
            months: 1,
            isApproved: true
        })

        expect(mockPreferenceRepository.update).toHaveBeenCalledWith(validPreference)
        expect(validPreference.status).toStrictEqual('APPROVED')
    })

    it('should throw error if payment is not approved', async () => {
        (mockPaymentRepository.verifyIfPaymentIsApprovedOrRejected as Mock).mockResolvedValue({
            products: [
                { id: validBarberShop.id, title: 'incremento contrato', quantity: 1, price: 30 }
            ],
            createdAt: new Date(),
            isApproved: false
        });
        (mockPreferenceRepository.findLastBy as Mock).mockResolvedValue(validPreference);

        const response = await validatePaymentUseCase.execute({ paymentId: '123' })

        expect(response).toStrictEqual({
            barberShopId: validBarberShop.id,
            months: 1,
            isApproved: false
        })

        expect(mockPreferenceRepository.update).toHaveBeenCalledWith(validPreference)
        expect(validPreference.status).toStrictEqual('REJECTED')
    })

    it('should throw if preference is not found on data base', async () => {
        (mockPaymentRepository.verifyIfPaymentIsApprovedOrRejected as Mock).mockResolvedValue({
            products: [
                { id: validBarberShop.id, title: 'incremento contrato', quantity: 1, price: 30 }
            ],
            createdAt: new Date(),
            isApproved: true
        });
        (mockPreferenceRepository.findLastBy as Mock).mockResolvedValue(undefined);

        const promise = validatePaymentUseCase.execute({ paymentId: '123' })

        await expect(promise).rejects.toThrow('Falha ao processar pagamento')

        expect(mockPreferenceRepository.update).not.toHaveBeenCalledWith(validPreference)
        expect(validPreference.status).toStrictEqual('PENDING')
    })

    it('should throw if payment isnt approved or rejected', async () => {
        (mockPaymentRepository.verifyIfPaymentIsApprovedOrRejected as Mock).mockRejectedValue(new Error('Pagemeto não encontrado'));
        (mockPreferenceRepository.findLastBy as Mock).mockResolvedValue(undefined);

        const promise = validatePaymentUseCase.execute({ paymentId: '123' })

        await expect(promise).rejects.toThrow('Pagemeto não encontrado')

        expect(mockPreferenceRepository.update).not.toHaveBeenCalledWith(validPreference)
        expect(validPreference.status).toStrictEqual('PENDING')
    })
})