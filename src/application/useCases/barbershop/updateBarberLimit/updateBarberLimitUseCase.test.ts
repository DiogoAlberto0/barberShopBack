import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

//use case
import { UpdateBarberLimitUseCase } from './updateBerberLimitUseCase'

//valid data for tests
import { mockBarberRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberRepository'
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'

const updateBarberShopUseCase = new UpdateBarberLimitUseCase(mockBarberShopRepository, mockBarberRepository)

describe('update barber shop use case test', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })

    it('should be possible to update barber limit from an existent barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockReturnValue(validBarberShop);
        (mockBarberRepository.countBarbersFromBarberShop as Mock).mockResolvedValue(10)

        const result = updateBarberShopUseCase.execute({
            barberShopId: '123',
            newLimit: 15
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(validBarberShop.getBarberLimit()).toStrictEqual(15)
        expect(mockBarberShopRepository.update).toBeCalledWith(validBarberShop)
    })

    it('should throw if barbershop not exists', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(null);
        (mockBarberRepository.countBarbersFromBarberShop as Mock).mockResolvedValue(10)

        const result = updateBarberShopUseCase.execute({
            barberShopId: '123',
            newLimit: 15
        })

        await expect(result).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockBarberShopRepository.update).not.toBeCalled()
    })

    it('should throw if new limir is more than barber quantity', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.countBarbersFromBarberShop as Mock).mockResolvedValue(20)

        const result = updateBarberShopUseCase.execute({
            barberShopId: '123',
            newLimit: 15
        })

        await expect(result).rejects.toThrow('O novo limite é menor que a quantidade de funcionários')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.countBarbersFromBarberShop).toBeCalledWith('123')
        expect(mockBarberShopRepository.update).not.toBeCalled()
    })






})