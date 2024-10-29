import { describe, it, expect, beforeEach, Mock, vi } from "vitest";

//use case 
import { SetBarberShopOperationUseCase } from "./setBarberShopOperationUseCase";

// valid data for tests
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";

const setBarberShopOperationUseCase = new SetBarberShopOperationUseCase(mockBarberShopRepository, mockManagerRepository);

// Função auxiliar para criar operações dinâmicas
const createOperation = (openHour: number, openMinute: number, closeHour: number, closeMinute: number) => ({
    open: { hour: openHour, minute: openMinute },
    close: { hour: closeHour, minute: closeMinute }
});

describe('set operation use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should be possible to set a valid operation to a valid barberShop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const operation = {
            "0": createOperation(8, 0, 18, 0),
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        };

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: validBarberShop.id,
            operation
        });

        await expect(result).resolves.not.toThrow();
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id);
        expect(mockBarberShopRepository.update).toBeCalledWith(validBarberShop);
    });

    it('should throw error if an invalid barber shop id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const operation = {
            "0": createOperation(8, 0, 18, 0),
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        };

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: '1234',
            operation
        });

        await expect(result).rejects.toThrow('Estabelecimento não encontrado');
        expect(mockBarberShopRepository.findById).toBeCalledWith('1234');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid operation day is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const operation = {
            "0": createOperation(8, 0, 18, 0),
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "10": null // Dia inválido
        } as any;

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: validBarberShop.id,
            operation
        });

        await expect(result).rejects.toThrow('Os dias devem ir de domingo até segunda');
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id);
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid operation hour is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const operation = {
            "0": createOperation(25, 0, 18, 0), // Hora inválida
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: validBarberShop.id,
            operation
        });

        await expect(result).rejects.toThrow('As horas devem estar entre 00 e 23');
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id);
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid operation minutes are provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const operation = {
            "0": createOperation(8, 65, 18, 0), // Minutos inválidos
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: validBarberShop.id,
            operation
        });

        await expect(result).rejects.toThrow('Os minutos devem estar entre 00 e 59');
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id);
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid manager id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const operation = {
            "0": createOperation(8, 0, 18, 0), // Minutos inválidos
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: validBarberShop.id,
            operation
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberShopRepository.findById).not.toBeCalledWith(validBarberShop.id);
        expect(mockManagerRepository.findById).toBeCalledWith('1234');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw error if an manager is not from barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        const operation = {
            "0": createOperation(8, 0, 18, 0), // Minutos inválidos
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberShopOperationUseCase.execute({
            managerId: '1234',
            barberShopId: validBarberShop.id,
            operation
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberShopRepository.findById).toBeCalledWith(validBarberShop.id);
        expect(mockManagerRepository.findById).toBeCalledWith('1234');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });
});
