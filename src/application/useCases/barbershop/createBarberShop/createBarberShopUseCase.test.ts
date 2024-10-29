import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

//entities
import { BarberShop } from '../../../../domain/Entities/BarberShop';

// use case
import { CreateBarberShopUseCase } from './createBarberShopUseCase';

//mock repositories
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';
import { validAddress } from '../../../../test/validEntitiesFromTests/validAddress';
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop';


const createBarberShopUseCase = new CreateBarberShopUseCase(
    mockBarberShopRepository,
    mockManagerRepository
);

describe('CreateBarberShopUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a new barber shop successfully', async () => {
        (mockManagerRepository.findById as Mock).mockReturnValue({ id: 123 });
        (mockBarberShopRepository.findByPhone as Mock).mockReturnValue(null);
        (mockBarberShopRepository.findByName as Mock).mockReturnValue(null);

        const result = await createBarberShopUseCase.execute({
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validBarberShop.address.props,
            contractExpirationDate: validBarberShop.getContractExpirationDate(),
            managerId: '123'
        });

        expect(result).toHaveProperty('id');
        expect(mockBarberShopRepository.create).toHaveBeenCalledWith(expect.any(BarberShop));
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123');
        expect(mockBarberShopRepository.findByPhone).toHaveBeenCalledWith(expect.objectContaining({ phoneNumber: validBarberShop.phone.phoneNumber }));
    });

    it('should throw an error if phone number is already in use', async () => {
        (mockManagerRepository.findById as Mock).mockReturnValue({ id: 123 });
        (mockBarberShopRepository.findByPhone as Mock).mockReturnValue({ id: 123 });

        const result = createBarberShopUseCase.execute({
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            address: validAddress.props,
            contractExpirationDate: new Date(),
            managerId: '123'
        });

        await expect(result).rejects.toThrow('Telefone já está em uso');
        expect(mockBarberShopRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if manager is not found', async () => {
        (mockManagerRepository.findById as Mock).mockReturnValue(null);

        const result = createBarberShopUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            address: validAddress.props,
            contractExpirationDate: new Date(),
            managerId: '123'
        });

        await expect(result).rejects.toThrow('Gerente não encontrado');
        expect(mockBarberShopRepository.create).not.toHaveBeenCalled();
    });

    it('should throw if address is alreadi in use', async () => {
        (mockManagerRepository.findById as Mock).mockReturnValue({ id: 123 });
        (mockBarberShopRepository.findByPhone as Mock).mockReturnValue(null);
        (mockBarberShopRepository.findByName as Mock).mockReturnValue(null);
        (mockBarberShopRepository.isAddressInUse as Mock).mockReturnValue(true);

        const result = createBarberShopUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            address: validAddress.props,
            contractExpirationDate: new Date(),
            managerId: '123'
        });

        await expect(result).rejects.toThrow('Endereço já está em uso')
        expect(mockBarberShopRepository.create).not.toHaveBeenCalledWith(expect.any(BarberShop));
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123');
        expect(mockBarberShopRepository.findByPhone).toHaveBeenCalledWith(expect.objectContaining({ phoneNumber: '61986548270' }));
    });
});
