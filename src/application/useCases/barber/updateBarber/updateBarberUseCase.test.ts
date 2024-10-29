// Test Framework
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// Use Case
import { UpdateBarberUseCase } from './updateBarberUseCase';

// Entities
import { Barber } from '../../../../domain/Entities/Barber';

// Interfaces
import { mockBarberRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberRepository';
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';

// valid data from tests
import { CPF } from '../../../../domain/valueObjects/CPF/CPF';
import { Phone } from '../../../../domain/valueObjects/Phone/Phone';
import { validBarber } from '../../../../test/validEntitiesFromTests/validBarber';
import { validBarberShop, validBarberShop2 } from '../../../../test/validEntitiesFromTests/validBarberShop';
import { validManager } from '../../../../test/validEntitiesFromTests/validManager';



// Test Suite
describe('UpdateBarberUseCase', () => {
    let updateBarberShopFromBarberUseCase: UpdateBarberUseCase;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();

        updateBarberShopFromBarberUseCase = new UpdateBarberUseCase(
            mockBarberRepository,
            mockBarberShopRepository,
            mockManagerRepository
        );
    });

    it('should successfully update the barber shop of the barber', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const result = await updateBarberShopFromBarberUseCase.execute({
            barberId: '1',
            name: 'Updated Barber Name',
            phone: '61912345678',
            cpf: '07156817108',
            managerId: '3',
        });

        expect(mockBarberRepository.update).toHaveBeenCalledWith(expect.any(Barber));
        expect(result).toHaveProperty('updatedBarber');
    });

    it('should throw error if name is already in use', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.isNameInUse as Mock).mockResolvedValue(true);

        const result = updateBarberShopFromBarberUseCase.execute({
            barberId: '1',
            name: 'Updated Barber Name',
            phone: '61912345678',
            cpf: '07156817108',
            managerId: '3',
        });


        await expect(result).rejects.toThrow('Nome já esta em uso')
        expect(mockBarberRepository.isNameInUse).toBeCalledWith('Updated Barber Name')
    });

    it('should throw error if phone is already in use', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        const result = updateBarberShopFromBarberUseCase.execute({
            barberId: '1',
            name: 'Updated Barber Name',
            phone: '61912345678',
            cpf: '07156817108',
            managerId: '3',
        });

        await expect(result).rejects.toThrow('Telefone já esta em uso')
        expect(mockBarberRepository.isPhoneInUse).toBeCalledWith(expect.any(Phone))
    });

    it('should throw error if CPF is already in use', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.isCPFInUse as Mock).mockResolvedValue(true);

        const newCPF = '07156817108'

        const result = updateBarberShopFromBarberUseCase.execute({
            barberId: '1',
            name: 'Updated Barber Name',
            phone: '61912345678',
            cpf: newCPF,
            managerId: '3',
        });


        await expect(result).rejects.toThrow('CPF já esta em uso')
        expect(mockBarberRepository.isCPFInUse).toBeCalledWith(expect.any(CPF))
    });

    it('should throw an error if the barber is not found', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);

        await expect(
            updateBarberShopFromBarberUseCase.execute({
                barberId: '1',
                name: 'Updated Barber Name',
                phone: '61912345678',

                managerId: '3',
            })
        ).rejects.toThrow('Funcionário não encontrado');
    });

    it('should throw an error if the manager is not found', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        await expect(
            updateBarberShopFromBarberUseCase.execute({
                barberId: '1',
                name: 'Updated Barber Name',
                phone: '61912345678',

                managerId: '3',
            })
        ).rejects.toThrow('Gerente não encontrado');
    });

    it('should throw an error if the barber shop is not found', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);

        await expect(
            updateBarberShopFromBarberUseCase.execute({
                barberId: '1',
                name: 'Updated Barber Name',
                phone: '61912345678',

                managerId: '3',
            })
        ).rejects.toThrow('Estabelecimento não encontrado');
    });

    it('should throw an error if the manager is not authorized', async () => {

        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop2);

        await expect(
            updateBarberShopFromBarberUseCase.execute({
                barberId: '1',
                name: 'Updated Barber Name',
                phone: '61912345678',

                managerId: '3',
            })
        ).rejects.toThrow('Gerente não autorizado');
    });




});
