import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { UpdateServiceUseCase } from './updateServiceUseCase';
import { Price } from '../../../../domain/valueObjects/Price/Price';
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';
import { mockServiceRepository } from '../../../../test/unit/vitestMockRepositories/mockServiceRepository';
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop';
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager';
import { validService } from '../../../../test/validEntitiesFromTests/validService';

const updateServiceUseCase = new UpdateServiceUseCase(mockServiceRepository, mockManagerRepository, mockBarberShopRepository)


describe('UpdateServiceUseCase', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('deve atualizar um serviço com sucesso', async () => {

        // Mock do método findById para retornar um serviço existente
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const input = {
            serviceId: '123',
            name: 'Novo Corte',
            description: 'Nova descrição',
            price: 50,
            timeInMinutes: 45,
            managerId: '1234'
        };

        await updateServiceUseCase.execute(input);

        expect(mockServiceRepository.findById).toHaveBeenCalledWith(input.serviceId);
        expect(mockServiceRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: input.serviceId,
                name: input.name,
                description: input.description,
                price: expect.any(Price),
                timeInMinutes: input.timeInMinutes,
            })
        );
    });

    it('deve lançar erro se o serviço não existir', async () => {
        const serviceId = '123';

        // Mock do método findById para retornar null
        (mockServiceRepository.findById as Mock).mockResolvedValue(null);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const input = {
            serviceId,
            name: 'Novo Corte',
            description: 'Nova descrição',
            price: 50,
            timeInMinutes: 45,
            managerId: '1234'
        };

        await expect(updateServiceUseCase.execute(input)).rejects.toThrow('Serviço não cadastrado');

        expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
        expect(mockServiceRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro se serviceId não for fornecido', async () => {

        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const input = {
            serviceId: '',
            name: 'Novo Corte',
            description: 'Nova descrição',
            price: 50,
            timeInMinutes: 45,
            managerId: '1234'
        };

        await expect(updateServiceUseCase.execute(input)).rejects.toThrow('O ID do serviço é obrigatório.');

        expect(mockServiceRepository.findById).not.toHaveBeenCalled();
        expect(mockServiceRepository.update).not.toHaveBeenCalled();
    });

    it('deve manter os campos não fornecidos inalterados', async () => {

        const serviceId = '123';

        // Mock do método findById para retornar um serviço existente
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const input = {
            serviceId,
            name: undefined,
            description: 'Nova descrição',
            price: undefined,
            timeInMinutes: undefined,
            managerId: '1234'
        };

        await updateServiceUseCase.execute(input);

        expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
        expect(mockServiceRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: serviceId,
                name: validService.name, // Deve permanecer inalterado
                description: input.description, // Atualizado
                price: validService.price, // Deve permanecer inalterado
                timeInMinutes: validService.timeInMinutes, // Deve permanecer inalterado
            })
        );
    });

    it('should throw an error if the provided name is already in use by another service from the same barber shop', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const input = {
            serviceId: '123',
            name: 'teste',
            managerId: '1234'
        }
        await expect(updateServiceUseCase.execute(input)).rejects.toThrow('Serviço com o mesmo nome já cadastrado')
        expect(mockServiceRepository.update).not.toHaveBeenCalled()

    })

    it('should throw if a invalid manager id is provided', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const input = {
            serviceId: '123',
            managerId: 'invalidManagerId'
        };

        await expect(updateServiceUseCase.execute(input)).rejects.toThrow('Usuário não autorizado');
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('invalidManagerId')
        expect(mockServiceRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar um erro se o manager não for da mesma barbearia do serviço', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const input = {
            serviceId: '123',
            managerId: 'managerIdFromDifferentBarberShop'
        };

        await expect(updateServiceUseCase.execute(input)).rejects.toThrow('Usuário não autorizado');
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('managerIdFromDifferentBarberShop')
        expect(mockServiceRepository.update).not.toHaveBeenCalled();
    });
});
