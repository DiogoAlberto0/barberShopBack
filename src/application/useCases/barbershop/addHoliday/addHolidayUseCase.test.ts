import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { AddHolidayUseCase } from "./addHolidayUseCase";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";

const addHolidayUseCase = new AddHolidayUseCase(mockBarberShopRepository, mockManagerRepository);

describe('AddHolidayUseCase tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('should add a holiday to a valid barbershop that is closed without open and close times', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: true,
        });

        await expect(result).resolves.not.toThrow();
        expect(mockBarberShopRepository.update).toBeCalledWith(validBarberShop);
    });

    it('should add a holiday to a valid barbershop that is not closed with open and close times', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: false,
            openTime: {
                hour: 8,
                minute: 0,
            },
            closeTime: {
                hour: 12,
                minute: 0,
            },
        });

        await expect(result).resolves.not.toThrow();
        expect(mockBarberShopRepository.update).toBeCalledWith(validBarberShop);
    });

    it('should throw an error if the barber shop ID is invalid', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: true,
        });

        await expect(result).rejects.toThrow('Estabelecimento não encontrado');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw an error if not closed and open and close times are not provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: false,
        });

        await expect(result).rejects.toThrow('Informe o horário de abertura e fechamento');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw an error if an invalid hour is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: false,
            openTime: {
                hour: 25,
                minute: 0,
            },
            closeTime: {
                hour: 0,
                minute: 0,
            },
        });

        await expect(result).rejects.toThrow('As horas devem estar entre 00 e 23');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw an error if an invalid minute is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: false,
            openTime: {
                hour: 0,
                minute: 70,
            },
            closeTime: {
                hour: 0,
                minute: 0,
            },
        });

        await expect(result).rejects.toThrow('Os minutos devem estar entre 00 e 59');
        expect(mockBarberShopRepository.update).not.toBeCalled();
    });

    it('should throw if a invalid manager id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: false,
            openTime: {
                hour: 0,
                minute: 70,
            },
            closeTime: {
                hour: 0,
                minute: 0,
            },
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberShopRepository.update).not.toBeCalled();
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
    });

    it('should throw if barberShop is not from manager', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        const result = addHolidayUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            date: new Date(),
            isClosed: false,
            openTime: {
                hour: 0,
                minute: 70,
            },
            closeTime: {
                hour: 0,
                minute: 0,
            },
        });

        await expect(result).rejects.toThrow('Usuário não autorizado');
        expect(mockBarberShopRepository.update).not.toBeCalled();
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
    });
});
