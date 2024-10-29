import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

//use case
import { GetBarbersByBarberShopUseCase } from './getBarbersByBarberShopUseCase';


//entities
import { Barber } from '../../../../domain/Entities/Barber';

//valid data from tests
import { mockBarberRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberRepository';
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';
import { mockBearerTokenRepository } from '../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository';
import { validBarber, validBarber2 } from '../../../../test/validEntitiesFromTests/validBarber';
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop';
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager';

const getAllBarberUseCase = new GetBarbersByBarberShopUseCase(mockBarberRepository, mockManagerRepository, mockBarberShopRepository, mockBearerTokenRepository);

// create barbers
const barbers: Barber[] = [validBarber, validBarber2];

describe('GetAllBarber UseCase', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('should return all barbers by barber shop if valid token is provided', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.getBarbersByBarberShop as Mock).mockResolvedValue(barbers);
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { isValid: true, id: validManager.id } });

        const result = await getAllBarberUseCase.execute({ managerToken: '123', barberShopId: validBarberShop.id });

        expect(result).toEqual({ barbers });
        expect(mockBarberRepository.getBarbersByBarberShop).toHaveBeenCalledWith(validBarberShop.id, false);
    });

    it('should returne only active barbers by barber shop if token is not provided', async () => {
        (mockBarberRepository.getBarbersByBarberShop as Mock).mockResolvedValue(barbers);

        const result = await getAllBarberUseCase.execute({ barberShopId: validBarberShop.id });

        expect(result).toEqual({ barbers });
        expect(mockBarberRepository.getBarbersByBarberShop).toHaveBeenCalledWith(validBarberShop.id, true);
    });

    it('should throw if manager is not from barber shop', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.getBarbersByBarberShop as Mock).mockResolvedValue(barbers);
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { isValid: true, id: validManager2.id } });

        const result = getAllBarberUseCase.execute({ managerToken: '123', barberShopId: validBarberShop.id });

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toHaveBeenCalledWith('123')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith(validManager2.id)
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith(validBarberShop.id)
        expect(mockBarberRepository.getBarbersByBarberShop).not.toHaveBeenCalledWith(validBarberShop.id, false);
    });
});
