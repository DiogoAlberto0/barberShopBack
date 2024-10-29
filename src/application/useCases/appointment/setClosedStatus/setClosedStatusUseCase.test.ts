import { describe, it, expect, vi, Mock, beforeEach } from 'vitest'
import { SetClosedStatusUseCase } from './setClosedStatusUseCase'
import { Appointment } from '../../../../domain/Entities/Appointment'
import { mockAppointmentRepository } from '../../../../test/unit/vitestMockRepositories/mockAppointmentRepository'
import { mockBarberRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberRepository'
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository'
import { validAppointment, closedValidAppointment, canceledValidAppointment } from '../../../../test/validEntitiesFromTests/validAppointments'
import { validBarber, validBarber2 } from '../../../../test/validEntitiesFromTests/validBarber'
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager'
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository'
import { validBarberShop } from '../../../../test/validEntitiesFromTests/validBarberShop'

const setClosedStatusUseCase = new SetClosedStatusUseCase(mockAppointmentRepository, mockBarberRepository, mockManagerRepository, mockBarberShopRepository)

describe('set closed status to appointment use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should set closed status for a valid appointment and a valid manager id', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        await setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })

        expect(mockAppointmentRepository.update).toHaveBeenCalledTimes(1)
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberRepository.findById).toHaveBeenCalledWith('1234')

        const updatedAppointment = (mockAppointmentRepository.update as Mock).mock.calls[0][0]
        expect(updatedAppointment).toBeInstanceOf(Appointment)
        expect(updatedAppointment.status).toBe('CLOSED')
        expect(updatedAppointment.id).toBe(validAppointment.id)
    })

    it('should set closed status for a valid appointment and a valid barber id', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        await setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })

        expect(mockAppointmentRepository.update).toHaveBeenCalledTimes(1)
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberRepository.findById).toHaveBeenCalledWith('1234')

        const updatedAppointment = (mockAppointmentRepository.update as Mock).mock.calls[0][0]
        expect(updatedAppointment).toBeInstanceOf(Appointment)
        expect(updatedAppointment.status).toBe('CLOSED')
        expect(updatedAppointment.id).toBe(validAppointment.id)
    })


    it('should throw if an invalid user id is provided', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const result = setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockAppointmentRepository.update).not.toBeCalled()
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberRepository.findById).toHaveBeenCalledWith('1234')
    })

    it('should throw if user id is from a barber from another barberShop', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber2);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const result = setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockAppointmentRepository.update).not.toBeCalled()
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberRepository.findById).toHaveBeenCalledWith('1234')
    })

    it('should throw if user id is from a manager from another barberShop', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const result = setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockAppointmentRepository.update).not.toBeCalled()
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberRepository.findById).toHaveBeenCalledWith('1234')
    })

    it('should throw an error if a appointment is not found', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        await expect(setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })).rejects.toThrow('Agendamento não encontrado')

        expect(mockAppointmentRepository.findById).toHaveBeenCalledWith('123')
        expect(mockAppointmentRepository.update).not.toHaveBeenCalled()
    })

    it('should throw an error if the appointment status is already closed', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(closedValidAppointment);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        await expect(setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })).rejects.toThrow('Agendamento já está fechado')

        expect(mockAppointmentRepository.findById).toHaveBeenCalledWith('123')
        expect(mockAppointmentRepository.update).not.toHaveBeenCalled()
    })

    it('should throw an error if the appointment status is canceled', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(canceledValidAppointment);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        await expect(setClosedStatusUseCase.execute({
            appointmentId: '123',
            userId: '1234'
        })).rejects.toThrow('Não é possível fechar um agendamento cancelado')

        expect(mockAppointmentRepository.findById).toHaveBeenCalledWith('123')
        expect(mockAppointmentRepository.update).not.toHaveBeenCalled()
    })
})