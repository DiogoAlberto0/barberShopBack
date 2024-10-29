import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { GetAppointmentsByCustomerUseCase } from './getAppointmentsByCustomerUseCase';
import { Customer } from '../../../../domain/Entities/Customer';

import { mockAppointmentRepository } from '../../../../test/unit/vitestMockRepositories/mockAppointmentRepository';
import { validAppointment } from '../../../../test/validEntitiesFromTests/validAppointments';
import { validCustomer } from '../../../../test/validEntitiesFromTests/validCustomer';

const getAppointmentsByCustomerUseCase = new GetAppointmentsByCustomerUseCase(mockAppointmentRepository);

const mockAppointments = [validAppointment];

const mockTotalCount = mockAppointments.length;

describe('GetAppointmentsByCustomerUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('deve retornar appointments e totalCount corretamente', async () => {
        (mockAppointmentRepository.findByCustomer as Mock).mockResolvedValue(mockAppointments);
        (mockAppointmentRepository.countByCustomer as Mock).mockResolvedValue(mockTotalCount);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);


        const result = await getAppointmentsByCustomerUseCase.execute({
            customerName: 'João Silva',
            customerCPF: '07156817108',
            customerPhone: '11999999999',
            page: 1,
            pageSize: 10
        });

        expect(result.appointments).toEqual(mockAppointments);
        expect(result.totalCount).toBe(mockTotalCount);
        expect(mockAppointmentRepository.findByCustomer).toHaveBeenCalledWith(
            expect.any(Customer),
            {
                skip: 0,
                limit: 10,
                date: undefined
            }
        );
        expect(mockAppointmentRepository.countByCustomer).toHaveBeenCalledWith(
            expect.any(Customer),
            undefined
        );
    });

    it('deve calcular o skip corretamente para diferentes páginas', async () => {
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);

        await getAppointmentsByCustomerUseCase.execute({
            customerName: 'João Silva',
            customerCPF: '07156817108',
            customerPhone: '11999999999',
            page: 2,
            pageSize: 5
        });

        expect(mockAppointmentRepository.findByCustomer).toHaveBeenCalledWith(
            expect.any(Customer),
            {
                skip: 5,
                limit: 5,
                date: undefined
            }
        );
    });

    it('deve passar a data corretamente quando fornecida', async () => {
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);

        const testDate = new Date('2023-01-01');

        await getAppointmentsByCustomerUseCase.execute({
            customerName: 'João Silva',
            customerCPF: '07156817108',
            customerPhone: '11999999999',
            page: 1,
            pageSize: 10,
            date: testDate
        });

        expect(mockAppointmentRepository.findByCustomer).toHaveBeenCalledWith(
            expect.any(Customer),
            {
                skip: 0,
                limit: 10,
                date: testDate
            }
        );
        expect(mockAppointmentRepository.countByCustomer).toHaveBeenCalledWith(
            expect.any(Customer),
            testDate
        );
    });
});
