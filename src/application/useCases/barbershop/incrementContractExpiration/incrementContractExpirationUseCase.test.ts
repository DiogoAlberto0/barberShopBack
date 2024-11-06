import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

// entities
import { BarberShop } from '../../../../domain/Entities/BarberShop'

// use case
import { IncrementContractExiprationUseCase } from './incrementContractExpirationUseCase'

// valid data from tests
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'


const incrementContractExpirationUseCase = new IncrementContractExiprationUseCase(mockBarberShopRepository)


describe('increment contract expiration use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks()
    })

    it('should update the contract expiration by 1 month', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop)

        const monthsToIncrement = 1
        const oldContractExpiration = validBarberShop.getContractExpirationDate()
        const expectNewContractExpiration = new Date(oldContractExpiration)
        expectNewContractExpiration.setMonth(oldContractExpiration.getMonth() + monthsToIncrement)

        const result = await incrementContractExpirationUseCase.execute({
            barberShopId: validBarberShop.id,
            months: monthsToIncrement
        })

        expect(result.newContractExpirationDate).toStrictEqual(expectNewContractExpiration)
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id)
        expect(mockBarberShopRepository.update).toBeCalledWith(expect.any(BarberShop))
    })

    it('should update the contract expiration by 10 months', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop)

        const monthsToIncrement = 10

        const oldContractExpiration = validBarberShop.getContractExpirationDate()
        const expectNewContractExpiration = new Date(oldContractExpiration)
        expectNewContractExpiration.setMonth(oldContractExpiration.getMonth() + monthsToIncrement)

        const result = await incrementContractExpirationUseCase.execute({
            barberShopId: validBarberShop.id,
            months: monthsToIncrement
        })

        expect(result.newContractExpirationDate.getDate()).toStrictEqual(expectNewContractExpiration.getDate())
        expect(result.newContractExpirationDate.getMonth()).toStrictEqual(expectNewContractExpiration.getMonth())
        expect(result.newContractExpirationDate.getFullYear()).toStrictEqual(expectNewContractExpiration.getFullYear())
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id)
        expect(mockBarberShopRepository.update).toBeCalledWith(expect.any(BarberShop))
    })

    it('should throw if barber shop not found', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(null)

        const monthsToIncrement = 1
        const oldContractExpiration = validBarberShop.getContractExpirationDate()
        const expectNewContractExpiration = new Date(oldContractExpiration)
        expectNewContractExpiration.setMonth(oldContractExpiration.getMonth() + monthsToIncrement)

        const result = incrementContractExpirationUseCase.execute({
            barberShopId: validBarberShop.id,
            months: monthsToIncrement
        })

        await expect(result).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id)
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should throw if months to increment is a negative number', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop)

        const monthsToIncrement = -10
        const oldContractExpiration = validBarberShop.getContractExpirationDate()
        const expectNewContractExpiration = new Date(oldContractExpiration)
        expectNewContractExpiration.setMonth(oldContractExpiration.getMonth() + monthsToIncrement)

        const result = incrementContractExpirationUseCase.execute({
            barberShopId: validBarberShop.id,
            months: monthsToIncrement
        })

        await expect(result).rejects.toThrow('Informe uma quantidade de meses válida')
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id)
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })
})