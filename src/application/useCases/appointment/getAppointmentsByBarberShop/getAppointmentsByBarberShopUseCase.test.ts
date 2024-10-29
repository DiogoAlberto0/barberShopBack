import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { GetAppointmentsByBarberShopUseCase } from './getAppointmentsByBarberShopUseCase';
import { mockAppointmentRepository } from '../../../../test/unit/vitestMockRepositories/mockAppointmentRepository';
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';
import { validAppointment } from '../../../../test/validEntitiesFromTests/validAppointments';
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop';
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager';
;


const getAppointmentsByBarberShopUseCase = new GetAppointmentsByBarberShopUseCase(mockAppointmentRepository, mockManagerRepository, mockBarberShopRepository)


const mockAppointments = [validAppointment]
const mockTotalCount = mockAppointments.length

describe('GetAppointmentsByBarberShopUseCase', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('deve retornar appointments e totalCount corretamente', async () => {
        (mockAppointmentRepository.findByBarberShop as Mock).mockResolvedValue(mockAppointments);
        (mockAppointmentRepository.countByBarberShop as Mock).mockResolvedValue(mockTotalCount);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const result = await getAppointmentsByBarberShopUseCase.execute({
            managerId: '1234',
            barberShopId: 'barberShop123',
            page: 1,
            pageSize: 10
        });

        expect(result.appointments).toEqual(mockAppointments);
        expect(result.totalCount).toBe(mockTotalCount);
        expect(mockAppointmentRepository.findByBarberShop).toHaveBeenCalledWith('barberShop123', {
            skip: 0,
            limit: 10,
            date: undefined
        });
        expect(mockAppointmentRepository.countByBarberShop).toHaveBeenCalledWith('barberShop123', undefined);
    });

    it('should throw if a invalid manager id is provided', async () => {

        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const result = getAppointmentsByBarberShopUseCase.execute({
            managerId: '1234',
            barberShopId: 'barberShop123',
            page: 2,
            pageSize: 5
        });

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
    });

    it('should throw if a invalid barberShop id is provided', async () => {

        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);

        const result = getAppointmentsByBarberShopUseCase.execute({
            managerId: '1234',
            barberShopId: 'barberShop123',
            page: 2,
            pageSize: 5
        });

        await expect(result).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('barberShop123')
    });

    it('should throw if manager is not from barberShop', async () => {

        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validManager2);

        const result = getAppointmentsByBarberShopUseCase.execute({
            managerId: '1234',
            barberShopId: 'barberShop123',
            page: 2,
            pageSize: 5
        });

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('barberShop123')
    });
    it('deve calcular o skip corretamente para diferentes páginas', async () => {

        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        await getAppointmentsByBarberShopUseCase.execute({
            managerId: '1234',
            barberShopId: 'barberShop123',
            page: 2,
            pageSize: 5
        });

        expect(mockAppointmentRepository.findByBarberShop).toHaveBeenCalledWith('barberShop123', {
            skip: 5,
            limit: 5,
            date: undefined
        });
    });

    it('deve passar a data corretamente quando fornecida', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const testDate = new Date('2023-01-01');

        await getAppointmentsByBarberShopUseCase.execute({
            managerId: '1234',
            barberShopId: 'barberShop123',
            page: 1,
            pageSize: 10,
            date: testDate
        });

        expect(mockAppointmentRepository.findByBarberShop).toHaveBeenCalledWith('barberShop123', {
            skip: 0,
            limit: 10,
            date: testDate
        });
        expect(mockAppointmentRepository.countByBarberShop).toHaveBeenCalledWith('barberShop123', testDate);
    });
});
