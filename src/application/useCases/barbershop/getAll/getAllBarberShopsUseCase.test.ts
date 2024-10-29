import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

//use case
import { GetAllBarberShopUseCase } from './getAllBarberShopsUseCase';

// valid data from tests
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { validBarberShop, validBarberShop2 } from '../../../../test/validEntitiesFromTests/validBarberShop';

const getAllBarberShopUseCase = new GetAllBarberShopUseCase(mockBarberShopRepository)

describe('get all barber shops use case test', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('should return all barber shops', async () => {
        (mockBarberShopRepository.list as Mock).mockResolvedValue([validBarberShop, validBarberShop2])

        const response = await getAllBarberShopUseCase.execute({})

        expect(response).toStrictEqual({ barberShops: [validBarberShop, validBarberShop2] })
        expect(mockBarberShopRepository.list).toBeCalled()
    })

    it('should return one barber shop', async () => {
        (mockBarberShopRepository.list as Mock).mockResolvedValue([validBarberShop])

        const response = await getAllBarberShopUseCase.execute({ page: 1, pageSize: 1 })

        expect(response).toStrictEqual({ barberShops: [validBarberShop] })
        expect(mockBarberShopRepository.list).toBeCalledWith({ skip: 0, limit: 1 })
    })

    it('should handle error from repository', async () => {
        (mockBarberShopRepository.list as Mock).mockRejectedValue(new Error('Repository Error'));

        await expect(getAllBarberShopUseCase.execute({})).rejects.toThrow('Erro ao buscar as barbearias: Repository Error');
    });

    it('should throw error on invalid page and pageSize', async () => {
        await expect(getAllBarberShopUseCase.execute({ page: -1, pageSize: 1 })).rejects.toThrow('O numero da página e o tamanho devem ser positivos');
        await expect(getAllBarberShopUseCase.execute({ page: 1, pageSize: -1 })).rejects.toThrow('O numero da página e o tamanho devem ser positivos');
    });
})