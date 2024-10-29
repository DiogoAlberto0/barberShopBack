import { describe, it, expect, vi, Mock, beforeEach } from "vitest"
import { AddDayOffUseCase } from "./addDayOffUseCase";
import { mockBarberRepository } from "../../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockManagerRepository } from "../../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { mockAppointmentRepository } from "../../../../../test/unit/vitestMockRepositories/mockAppointmentRepository";
import { validAppointment } from "../../../../../test/validEntitiesFromTests/validAppointments";
import { validBarber } from "../../../../../test/validEntitiesFromTests/validBarber";
import { validManager, validManager2 } from "../../../../../test/validEntitiesFromTests/validManager";

const addDayOffUseCase = new AddDayOffUseCase(mockBarberRepository, mockManagerRepository, mockAppointmentRepository)

describe('add day off use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should add day off from a valid barber', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const date = new Date();

        const result = addDayOffUseCase.execute({
            managerId: '1234',
            barberId: '123',
            date: date
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.isRegisteredDayOff).toBeCalledWith('123', date)
        expect(mockBarberRepository.addDayOff).toBeCalledWith('123', date)

    })

    it('should throw error if a invalid barber id is provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(true);

        const date = new Date()

        const result = addDayOffUseCase.execute({
            managerId: '1234',
            barberId: '123',
            date
        })

        await expect(result).rejects.toThrow('Funcionário não encontrado')
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.isRegisteredDayOff).not.toBeCalledWith('123', date)
        expect(mockBarberRepository.addDayOff).not.toBeCalledWith('123', date)
    })

    it('should throw error if day off already exist', async () => {

        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(true);

        const date = new Date()

        const result = addDayOffUseCase.execute({
            managerId: '1234',
            barberId: "123",
            date
        });

        await expect(result).rejects.toThrow("Folga ja cadastrada");
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.isRegisteredDayOff).toBeCalledWith('123', date)
        expect(mockBarberRepository.addDayOff).not.toBeCalledWith('123', date)

    })

    it('should throw error if manager is not from the same barber shop', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);

        const date = new Date()

        const result = addDayOffUseCase.execute({
            barberId: "123",
            managerId: '1234',
            date
        });


        await expect(result).rejects.toThrow("Usuário não autorizado");
        expect(mockBarberRepository.findById).toBeCalledWith("123");
        expect(mockManagerRepository.findById).toBeCalledWith("1234");
        expect(mockBarberRepository.isRegisteredDayOff).not.toBeCalledWith('123', date)
        expect(mockBarberRepository.addDayOff).not.toBeCalledWith('123', date)

    })

    it('should throw error manager id is not provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);

        const date = new Date()

        const result = addDayOffUseCase.execute({
            barberId: "123",
            managerId: '',
            date
        });


        await expect(result).rejects.toThrow("Usuário não autorizado");
        expect(mockBarberRepository.findById).not.toBeCalledWith("123");
        expect(mockManagerRepository.findById).toBeCalledWith('');
        expect(mockBarberRepository.isRegisteredDayOff).not.toBeCalledWith('123', date)
        expect(mockBarberRepository.addDayOff).not.toBeCalledWith('123', date)

    })

    it('should throw error if barber has appointment in this date', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isRegisteredDayOff as Mock).mockResolvedValue(false);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([validAppointment]);


        const date = new Date()

        const result = addDayOffUseCase.execute({
            barberId: "123",
            managerId: '1234',
            date
        });


        await expect(result).rejects.toThrow("O funcionário possui agendamentos nessa data");
        expect(mockBarberRepository.findById).toBeCalledWith("123");
        expect(mockManagerRepository.findById).toBeCalledWith('1234');
        expect(mockBarberRepository.isRegisteredDayOff).toBeCalledWith('123', date)
        expect(mockBarberRepository.addDayOff).not.toBeCalledWith('123', date)

    })


})