import { vi } from "vitest";
import { IAppointmentRepository } from "../../../application/interfaces/repository/appointmentRepository.interface";


export const mockAppointmentRepository: IAppointmentRepository = {
    countByBarber: vi.fn(),
    countByBarberShop: vi.fn(),
    countByCustomer: vi.fn(),
    create: vi.fn(),
    findByBarber: vi.fn(),
    findByBarberAndDate: vi.fn(),
    findByBarberShop: vi.fn(),
    findByCustomer: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    findCustomer: vi.fn(),
    findCustomerById: vi.fn()
}