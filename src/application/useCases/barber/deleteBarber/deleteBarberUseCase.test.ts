import { describe, vi, it, expect, Mock, beforeEach } from "vitest";
import { DeleteBarberUseCase } from "./deleteBarberUseCase";
import { mockBarberRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { mockAppointmentRepository } from "../../../../test/unit/vitestMockRepositories/mockAppointmentRepository";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";

const deleteBarberUseCase = new DeleteBarberUseCase(mockBarberRepository, mockManagerRepository, mockAppointmentRepository)

describe('delete barber use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should delete a valid and existing barber', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockAppointmentRepository.findByBarber as Mock).mockResolvedValue([]);

        const result = deleteBarberUseCase.execute({
            managerId: '1234',
            barberId: '123'
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
        expect(mockBarberRepository.delete).toBeCalledWith('123')
    })

    it('should throw if manager id is not provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const result = deleteBarberUseCase.execute({
            managerId: '',
            barberId: '123'
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).not.toBeCalledWith('1234')
        expect(mockBarberRepository.delete).not.toBeCalledWith('123')
    })

    it('should throw if manager is not form barber barberShop', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        const result = deleteBarberUseCase.execute({
            managerId: '1234',
            barberId: '123'
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
        expect(mockBarberRepository.delete).not.toBeCalledWith('123')
    })

    it('should throw an error if barberId is not provided', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber)

        const result = deleteBarberUseCase.execute({
            managerId: '1234',
            barberId: ''
        })

        await expect(result).rejects.toThrow('ID inválido')
        expect(mockBarberRepository.findById).not.toBeCalled()
        expect(mockBarberRepository.delete).not.toBeCalled()
    })

    it('should throw an error if the barber is not found', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined)

        const result = deleteBarberUseCase.execute({
            managerId: '1234',
            barberId: '123'
        })

        await expect(result).rejects.toThrow('Funcionário não encontrado')
        expect(mockBarberRepository.findById).toBeCalledWith('123')
        expect(mockBarberRepository.delete).not.toBeCalled()
    })

})

