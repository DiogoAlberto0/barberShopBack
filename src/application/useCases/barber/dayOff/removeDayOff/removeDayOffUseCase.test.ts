import { describe, it, expect, vi, Mock, beforeEach } from "vitest"
import { RemoveDayOffUseCase } from "./removeDayOffUseCase";
import { mockBarberRepository } from "../../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockManagerRepository } from "../../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { validBarber } from "../../../../../test/validEntitiesFromTests/validBarber";
import { validManager, validManager2 } from "../../../../../test/validEntitiesFromTests/validManager";
const removeDayOffUseCase = new RemoveDayOffUseCase(mockBarberRepository, mockManagerRepository)

describe('remove day off use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should remove day off from a valid barber', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(true);


        const date = new Date();

        validBarber.addDayOff(date)

        const result = removeDayOffUseCase.execute({
            managerId: '1234',
            barberId: '123',
            date: date
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.isRegisteredDayOff).toBeCalledWith('123', date)
        expect(mockBarberRepository.removeDayOff).toBeCalledWith('123', date)

    })

    it('should throw error if a invalid barber id is provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(true);

        const date = new Date()

        const result = removeDayOffUseCase.execute({
            managerId: '1234',
            barberId: '123',
            date
        })

        await expect(result).rejects.toThrow('Funcionário não encontrado')
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.isRegisteredDayOff).not.toBeCalledWith('123', date)
        expect(mockBarberRepository.removeDayOff).not.toBeCalledWith('123', date)
    })

    it('should throw error if day off does not exist', async () => {

        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);

        const date = new Date()

        const result = removeDayOffUseCase.execute({
            managerId: '1234',
            barberId: "123",
            date
        });

        await expect(result).rejects.toThrow("Folga não cadastrada");
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.isRegisteredDayOff).toBeCalledWith('123', date)
        expect(mockBarberRepository.removeDayOff).not.toBeCalledWith('123', date)

    })

    it('should throw error if manager is not from the same barber shop', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);

        const date = new Date()

        const result = removeDayOffUseCase.execute({
            barberId: "123",
            managerId: '1234',
            date
        });


        await expect(result).rejects.toThrow("Usuário não autorizado");
        expect(mockBarberRepository.findById).toBeCalledWith("123");
        expect(mockManagerRepository.findById).toBeCalledWith("1234");
        expect(mockBarberRepository.isRegisteredDayOff).not.toBeCalledWith('123', date)
        expect(mockBarberRepository.removeDayOff).not.toBeCalledWith('123', date)

    })

    it('should throw error manager id is not provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);

        const date = new Date()

        const result = removeDayOffUseCase.execute({
            barberId: "123",
            managerId: '',
            date
        });


        await expect(result).rejects.toThrow("Usuário não autorizado");
        expect(mockBarberRepository.findById).not.toBeCalledWith("123");
        expect(mockManagerRepository.findById).toBeCalledWith('');
        expect(mockBarberRepository.isRegisteredDayOff).not.toBeCalledWith('123', date)
        expect(mockBarberRepository.removeDayOff).not.toBeCalledWith('123', date)

    })


})