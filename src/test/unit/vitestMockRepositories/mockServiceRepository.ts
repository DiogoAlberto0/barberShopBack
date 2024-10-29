import { vi } from "vitest";
import { IServiceRepository } from "../../../application/interfaces/repository/servicesRepository.interface";


export const mockServiceRepository: IServiceRepository = {
    create: vi.fn(),
    delete: vi.fn(),
    findByBarberShop: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    findByNameAndBarberShop: vi.fn(),
    update: vi.fn(),
}