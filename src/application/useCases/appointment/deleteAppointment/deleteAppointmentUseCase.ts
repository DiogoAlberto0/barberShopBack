import { Appointment } from "../../../../domain/Entities/Appointment";
import { Customer } from "../../../../domain/Entities/Customer";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

type IDeleteAppointmentInputDTO = {
    appointmentId: string;
    customerName: string;
    customerCPF: string;
    customerPhone: string;
};

type IDeleteAppointmentOutputDTO = void;

export class DeleteAppointmentUseCase implements IUseCase<IDeleteAppointmentInputDTO, IDeleteAppointmentOutputDTO> {
    constructor(
        private appointmentRepository: IAppointmentRepository
    ) { }

    async execute({
        appointmentId,
        customerName,
        customerCPF,
        customerPhone,
    }: IDeleteAppointmentInputDTO): Promise<IDeleteAppointmentOutputDTO> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) throw new Error('Agendamento não encontrado')

        const customer = Customer.build({
            name: customerName,
            cpf: new CPF(customerCPF),
            phone: new Phone(customerPhone),
        });

        const customerFromDB = await this.appointmentRepository.findCustomerById(appointment.customerId)
        if (!customerFromDB) throw new Error('Agendamento não encontrado')

        if (!this.isCustomerAppointment(customerFromDB, customer)) throw new Error('Cliente não autorizado')

        await this.appointmentRepository.update({
            ...appointment,
            status: "CANCELED",
        });

    }

    private isCustomerAppointment(customerFromDB: Customer, customer: Customer): boolean {
        return (
            customerFromDB.name === customer.name &&
            customerFromDB.cpf.cleaned === customer.cpf.cleaned &&
            customerFromDB.phone.phoneNumber === customer.phone.phoneNumber
        );
    }
}
