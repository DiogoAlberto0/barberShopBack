import { describe, it, expect, vi, Mock, beforeEach } from "vitest"
import { GetAppointmentsByBarberUseCase } from "./getAppointmentsByBarberUseCase"
import { mockAppointmentRepository } from "../../../../test/unit/vitestMockRepositories/mockAppointmentRepository";

const getAppointmentsByBarberUseCase = new GetAppointmentsByBarberUseCase(mockAppointmentRepository)

describe('get appointments by barber use case', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve retornar uma lista de agendamentos e a contagem total', async () => {
        const mockAppointments = [
            { id: '1', barberId: 'barber1', date: new Date() },
            { id: '2', barberId: 'barber1', date: new Date() }
        ];
        const mockTotalCount = 2;

        (mockAppointmentRepository.findByBarber as Mock).mockResolvedValue(mockAppointments);
        (mockAppointmentRepository.countByBarber as Mock).mockResolvedValue(mockTotalCount);

        const result = await getAppointmentsByBarberUseCase.execute({
            barberId: 'barber1',
            page: 1,
            pageSize: 10
        });

        expect(result.appointments).toEqual(mockAppointments);
        expect(result.totalCount).toBe(mockTotalCount);
        expect(mockAppointmentRepository.findByBarber).toHaveBeenCalledWith('barber1', { skip: 0, limit: 10, date: undefined });
        expect(mockAppointmentRepository.countByBarber).toHaveBeenCalledWith('barber1', undefined);
    });

    it('deve aplicar a paginação corretamente', async () => {
        await getAppointmentsByBarberUseCase.execute({
            barberId: 'barber1',
            page: 2,
            pageSize: 5
        });

        expect(mockAppointmentRepository.findByBarber).toHaveBeenCalledWith('barber1', { skip: 5, limit: 5, date: undefined });
    });

    it('deve filtrar por data quando fornecida', async () => {
        const testDate = new Date('2023-05-01');

        await getAppointmentsByBarberUseCase.execute({
            barberId: 'barber1',
            page: 1,
            pageSize: 10,
            date: testDate
        });

        expect(mockAppointmentRepository.findByBarber).toHaveBeenCalledWith('barber1', { skip: 0, limit: 10, date: testDate });
        expect(mockAppointmentRepository.countByBarber).toHaveBeenCalledWith('barber1', testDate);
    });

    it('deve lidar com o caso de nenhum agendamento encontrado', async () => {
        (mockAppointmentRepository.findByBarber as Mock).mockResolvedValue([]);
        (mockAppointmentRepository.countByBarber as Mock).mockResolvedValue(0);

        const result = await getAppointmentsByBarberUseCase.execute({
            barberId: 'barber1',
            page: 1,
            pageSize: 10
        });

        expect(result.appointments).toEqual([]);
        expect(result.totalCount).toBe(0);
    });
})