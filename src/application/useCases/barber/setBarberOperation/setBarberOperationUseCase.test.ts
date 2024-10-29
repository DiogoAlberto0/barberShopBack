import { describe, it, expect, beforeEach, Mock, vi } from "vitest";

//use case 
import { SetBarberOperationUseCase } from "./setBarberOperationUseCase";

// valid data for tests
import { mockBarberRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";

const setBarberOperationUseCase = new SetBarberOperationUseCase(mockBarberRepository, mockManagerRepository);

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
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
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

        const result = setBarberOperationUseCase.execute({
            managerId: validManager.id,
            barberId: validBarber.id,
            operation
        });

        await expect(result).resolves.not.toThrow();
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockManagerRepository.findById).toBeCalledWith(validManager.id);
        expect(mockBarberRepository.update).toBeCalledWith(validBarber);
    });

    it('should throw error if an invalid barber id is provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);
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

        const result = setBarberOperationUseCase.execute({
            managerId: validManager.id,
            barberId: '1234',
            operation
        });

        await expect(result).rejects.toThrow('Funcionário não encontrado');
        expect(mockBarberRepository.findById).toBeCalledWith('1234');
        expect(mockBarberRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid operation day is provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
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

        const result = setBarberOperationUseCase.execute({
            managerId: validManager.id,
            barberId: validBarber.id,
            operation
        });

        await expect(result).rejects.toThrow('Os dias devem ir de domingo até segunda');
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockBarberRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid operation hour is provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
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

        const result = setBarberOperationUseCase.execute({
            managerId: validManager.id,
            barberId: validBarber.id,
            operation
        });

        await expect(result).rejects.toThrow('As horas devem estar entre 00 e 23');
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockBarberRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid operation minutes are provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
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

        const result = setBarberOperationUseCase.execute({
            managerId: validManager.id,
            barberId: validBarber.id,
            operation
        });

        await expect(result).rejects.toThrow('Os minutos devem estar entre 00 e 59');
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockBarberRepository.update).not.toBeCalled();
    });

    it('should throw error if manager id is not provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const operation = {
            "0": createOperation(8, 65, 18, 0), // Minutos inválidos
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberOperationUseCase.execute({
            managerId: '',
            barberId: validBarber.id,
            operation
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockManagerRepository.findById).toBeCalledWith('');
        expect(mockBarberRepository.update).not.toBeCalled();
    });

    it('should throw error if an invalid manager id is provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const operation = {
            "0": createOperation(8, 65, 18, 0), // Minutos inválidos
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberOperationUseCase.execute({
            managerId: '123',
            barberId: validBarber.id,
            operation
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockManagerRepository.findById).toBeCalledWith('123');
        expect(mockBarberRepository.update).not.toBeCalled();
    });

    it('should throw error if the manager is not from the same barber shop from the barber', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        const operation = {
            "0": createOperation(8, 65, 18, 0), // Minutos inválidos
            "1": createOperation(8, 0, 18, 0),
            "2": createOperation(8, 0, 18, 0),
            "3": createOperation(8, 0, 18, 0),
            "4": createOperation(8, 0, 18, 0),
            "5": createOperation(8, 0, 18, 0),
            "6": null
        } as any;

        const result = setBarberOperationUseCase.execute({
            managerId: '123',
            barberId: validBarber.id,
            operation
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberRepository.findById).toBeCalledWith(validBarber.id);
        expect(mockManagerRepository.findById).toBeCalledWith('123');
        expect(mockBarberRepository.update).not.toBeCalled();
    });
});
