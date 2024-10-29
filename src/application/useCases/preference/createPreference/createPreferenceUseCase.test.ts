import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { CreatePreferenceUseCase } from './createPreferenceUseCase'
import { mockPaymentRepository } from '../../../../test/unit/vitestMockRepositories/mockPaymentRepository'
import { mockPreferenceRepository } from '../../../../test/unit/vitestMockRepositories/mockPreferenceRepository'
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'
import { Preference } from '../../../../domain/Entities/Preference'
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository'
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager'


const createPreferenceUseCase = new CreatePreferenceUseCase(mockPaymentRepository, mockPreferenceRepository, mockBarberShopRepository, mockManagerRepository)


describe('create preference use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })

    it('shoud be possible to create a new preference', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockPaymentRepository.createPreference as Mock).mockResolvedValue({ paymentUrl: 'http://teste.com.br/checkout', preferenceId: '12345' });


        const response = await createPreferenceUseCase.execute({
            barberShopId: '123',
            managerId: '1234',
            quantity: 1
        })

        expect(response).toStrictEqual({
            paymentUrl: 'http://teste.com.br/checkout', preferenceId: '12345'
        })
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockPaymentRepository.createPreference).toHaveBeenCalledWith(expect.arrayContaining([
            {
                id: expect.any(String),
                title: expect.any(String),
                quantity: expect.any(Number),
                price: expect.any(Number)
            }
        ]))

        expect(mockPreferenceRepository.save).toHaveBeenCalledWith(expect.any(Preference))
    })

    it('shoud throw if an invalid barber shop id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockPaymentRepository.createPreference as Mock).mockResolvedValue({ paymentUrl: 'http://teste.com.br/checkout', preferenceId: '12345' });


        const promise = createPreferenceUseCase.execute({
            barberShopId: '123',
            managerId: '1234',
            quantity: 1
        })

        await expect(promise).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).not.toHaveBeenCalledWith('1234')
        expect(mockPaymentRepository.createPreference).not.toHaveBeenCalledWith(expect.arrayContaining([
            {
                id: expect.any(String),
                title: expect.any(String),
                quantity: expect.any(Number),
                price: expect.any(Number)
            }
        ]))

        expect(mockPreferenceRepository.save).not.toHaveBeenCalledWith(expect.any(Preference))
    })

    it('shoud throw if an invalid quantity is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockPaymentRepository.createPreference as Mock).mockResolvedValue({ paymentUrl: 'http://teste.com.br/checkout', preferenceId: '12345' });


        const promise = createPreferenceUseCase.execute({
            barberShopId: '123',
            managerId: '1234',
            quantity: 0
        })

        await expect(promise).rejects.toThrow('A quantidade deve ser maior que zero')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockPaymentRepository.createPreference).not.toHaveBeenCalledWith(expect.arrayContaining([
            {
                id: expect.any(String),
                title: expect.any(String),
                quantity: expect.any(Number),
                price: expect.any(Number)
            }
        ]))

        expect(mockPreferenceRepository.save).not.toHaveBeenCalledWith(expect.any(Preference))
    })

    it('shoud throw if the comunication with the payment repository fail', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockPaymentRepository.createPreference as Mock).mockRejectedValue({ message: 'Falha ao criar a preferência' });


        const promise = createPreferenceUseCase.execute({
            barberShopId: '123',
            managerId: '1234',
            quantity: 10
        })

        await expect(promise).rejects.toThrow('Falha ao criar a preferência')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockPaymentRepository.createPreference).toHaveBeenCalledWith(expect.arrayContaining([
            {
                id: expect.any(String),
                title: expect.any(String),
                quantity: expect.any(Number),
                price: expect.any(Number)
            }
        ]))

        expect(mockPreferenceRepository.save).not.toHaveBeenCalledWith(expect.any(Preference))
    })

    it('shoud throw if invalid manager id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockPaymentRepository.createPreference as Mock).mockRejectedValue({ message: 'Falha ao criar a preferência' });


        const promise = createPreferenceUseCase.execute({
            barberShopId: '123',
            managerId: '1234',
            quantity: 10
        })

        await expect(promise).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockPaymentRepository.createPreference).not.toHaveBeenCalledWith(expect.arrayContaining([
            {
                id: expect.any(String),
                title: expect.any(String),
                quantity: expect.any(Number),
                price: expect.any(Number)
            }
        ]))

        expect(mockPreferenceRepository.save).not.toHaveBeenCalledWith(expect.any(Preference))
    })

    it('shoud throw if manager is not from barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockPaymentRepository.createPreference as Mock).mockRejectedValue({ message: 'Falha ao criar a preferência' });


        const promise = createPreferenceUseCase.execute({
            barberShopId: '123',
            managerId: '1234',
            quantity: 10
        })

        await expect(promise).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockPaymentRepository.createPreference).not.toHaveBeenCalledWith(expect.arrayContaining([
            {
                id: expect.any(String),
                title: expect.any(String),
                quantity: expect.any(Number),
                price: expect.any(Number)
            }
        ]))

        expect(mockPreferenceRepository.save).not.toHaveBeenCalledWith(expect.any(Preference))
    })
})