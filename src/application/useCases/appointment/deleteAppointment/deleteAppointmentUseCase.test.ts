import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { DeleteAppointmentUseCase } from './deleteAppointmentUseCase';
import { Customer } from '../../../../domain/Entities/Customer';
import { CPF } from '../../../../domain/valueObjects/CPF/CPF';
import { Phone } from '../../../../domain/valueObjects/Phone/Phone';
import { mockAppointmentRepository } from '../../../../test/unit/vitestMockRepositories/mockAppointmentRepository';
import { validAppointment } from '../../../../test/validEntitiesFromTests/validAppointments';
import { validCustomer } from '../../../../test/validEntitiesFromTests/validCustomer';

const deleteAppointmentUseCase = new DeleteAppointmentUseCase(mockAppointmentRepository);

describe('DeleteAppointmentUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('deve apagar um agendamento com sucesso', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockAppointmentRepository.findCustomerById as Mock).mockResolvedValue(validCustomer);

        await expect(deleteAppointmentUseCase.execute({
            appointmentId: validAppointment.id,
            customerName: validCustomer.name,
            customerCPF: validCustomer.cpf.cleaned,
            customerPhone: validCustomer.phone.phoneNumber
        })).resolves.not.toThrow();

        expect(mockAppointmentRepository.update).toHaveBeenCalledWith({
            ...validAppointment,
            status: "CANCELED"
        });
    });

    it('deve lançar erro se o agendamento não for encontrado', async () => {
        (mockAppointmentRepository.findById as Mock).mockResolvedValue(null);
        (mockAppointmentRepository.findCustomerById as Mock).mockResolvedValue(validCustomer);

        await expect(deleteAppointmentUseCase.execute({
            appointmentId: 'id-inexistente',
            customerName: validCustomer.name,
            customerCPF: validCustomer.cpf.cleaned,
            customerPhone: validCustomer.phone.phoneNumber
        })).rejects.toThrow('Agendamento não encontrado');
    });

    it('deve lançar erro se o cliente não for autorizado', async () => {
        const differentCustomer = Customer.build({
            name: 'Maria Souza',
            cpf: new CPF('70157162168'),
            phone: new Phone('11988888888')
        });

        (mockAppointmentRepository.findById as Mock).mockResolvedValue(validAppointment);
        (mockAppointmentRepository.findCustomerById as Mock).mockResolvedValue(validCustomer);

        await expect(deleteAppointmentUseCase.execute({
            appointmentId: validAppointment.id,
            customerName: differentCustomer.name,
            customerCPF: differentCustomer.cpf.cleaned,
            customerPhone: differentCustomer.phone.phoneNumber
        })).rejects.toThrow('Cliente não autorizado');
    });
});
