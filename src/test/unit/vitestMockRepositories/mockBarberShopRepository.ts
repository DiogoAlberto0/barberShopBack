import { vi } from "vitest";
import { IBarberShopRepository } from "../../../application/interfaces/repository/barberShopRepository.interface";


export const mockBarberShopRepository: IBarberShopRepository = {
    create: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    findByPhone: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    deleteHoliday: vi.fn(),
    isAddressInUse: vi.fn()
}