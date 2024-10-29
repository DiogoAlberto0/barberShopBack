import { Appointment } from "../../../domain/Entities/Appointment";
import { Customer } from "../../../domain/Entities/Customer";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";


export interface IAppointmentRepository {
    create(appointment: Appointment): Promise<void>;
    findByBarberAndDate(barberId: string, date: Date): Promise<Appointment[]>;
    findByBarber(barberId: string, options?: { skip?: number, limit?: number, date?: Date }): Promise<Appointment[]>;
    countByBarber(barberId: string, date?: Date): Promise<number>;
    findByBarberShop(barberShopId: string, options?: { skip?: number, limit?: number, date?: Date }): Promise<Appointment[]>;
    countByBarberShop(barberShopId: string, date?: Date): Promise<number>;
    findByCustomer(customer: Customer, options?: { skip?: number, limit?: number, date?: Date }): Promise<Appointment[]>;
    countByCustomer(customer: Customer, date?: Date): Promise<number>;
    findById(appointmentId: string): Promise<Appointment | undefined>;
    update(appointment: Appointment): Promise<void>;
    findCustomer(name: string, phone: Phone, cpf: CPF): Promise<Customer | undefined>;
    findCustomerById(customerId: string): Promise<Customer | undefined>;
}