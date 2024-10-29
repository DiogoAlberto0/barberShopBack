import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { DeleteServiceUseCase } from "./deleteServiceUseCase";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { mockServiceRepository } from "../../../../test/unit/vitestMockRepositories/mockServiceRepository";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";
import { validService } from "../../../../test/validEntitiesFromTests/validService";


const deleteServiceUseCase = new DeleteServiceUseCase(mockServiceRepository, mockManagerRepository, mockBarberShopRepository)

describe('delete service use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should delete an valid service', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        await expect(deleteServiceUseCase.execute({ serviceId: '123', managerId: '1234' })).resolves.not.toThrow()
        expect(mockServiceRepository.findById).toHaveBeenCalledWith('123')
        expect(mockServiceRepository.delete).toHaveBeenCalledWith(validService.id)
    })

    it('should throw error if a invalid id is provided', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        await expect(deleteServiceUseCase.execute({ serviceId: '123', managerId: '1234' })).rejects.toThrow('Serviço não cadastrado')
        expect(mockServiceRepository.findById).toHaveBeenCalledWith('123')
    })

    it('should throw error if id is not provided', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        await expect(deleteServiceUseCase.execute({ serviceId: '', managerId: '1234' })).rejects.toThrow('O ID do serviço é obrigatório')
        expect(mockServiceRepository.findById).not.toHaveBeenCalled()
        expect(mockServiceRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw error if manager id is not provided', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        await expect(deleteServiceUseCase.execute({ serviceId: '123', managerId: '1234' })).rejects.toThrow('Usuário não autorizado')
        expect(mockServiceRepository.findById).not.toHaveBeenCalled()
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockServiceRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw error if manager is not from barberShop from service', async () => {
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        await expect(deleteServiceUseCase.execute({ serviceId: '123', managerId: '1234' })).rejects.toThrow('Usuário não autorizado')
        expect(mockServiceRepository.findById).toHaveBeenCalled()
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
    })

})