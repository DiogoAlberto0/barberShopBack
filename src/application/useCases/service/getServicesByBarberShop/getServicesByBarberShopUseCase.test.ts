import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GetServicesByBarberShopUseCase } from "./getServicesByBarberShopUseCase";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockServiceRepository } from "../../../../test/unit/vitestMockRepositories/mockServiceRepository";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validService } from "../../../../test/validEntitiesFromTests/validService";

const getServicesByBarberShop = new GetServicesByBarberShopUseCase(mockBarberShopRepository, mockServiceRepository)

describe('get services by barber shop use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should return services from a valid barber', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findByBarberShop as Mock).mockResolvedValue([validService])

        const { services } = await getServicesByBarberShop.execute({ barberShopId: '123' })

        expect(services).toStrictEqual([validService])
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockServiceRepository.findByBarberShop).toHaveBeenCalledWith('123')
    })

    it('should throw if a invalid barber shop id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);

        expect(getServicesByBarberShop.execute({ barberShopId: '123' })).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('123')
        expect(mockServiceRepository.findByBarberShop).not.toHaveBeenCalled()
    })

    it('should throw if a barber shop id is not provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);

        expect(getServicesByBarberShop.execute({ barberShopId: '' })).rejects.toThrow('O ID da barbearia é obrigatório')
        expect(mockBarberShopRepository.findById).not.toHaveBeenCalled()
        expect(mockServiceRepository.findByBarberShop).not.toHaveBeenCalled()
    })
})