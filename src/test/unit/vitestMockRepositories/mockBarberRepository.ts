import { vi } from "vitest";
import { IBarberRepository } from "../../../application/interfaces/repository/barberRepository.interface";


export const mockBarberRepository: IBarberRepository = {
    addDayOff: vi.fn(),
    countBarbersFromBarberShop: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    findByCPF: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    findByPhone: vi.fn(),
    getBarbersByBarberShop: vi.fn(),
    isCPFInUse: vi.fn(),
    isNameInUse: vi.fn(),
    isPhoneInUse: vi.fn(),
    isRegisteredDayOff: vi.fn(),
    list: vi.fn(),
    removeDayOff: vi.fn(),
    update: vi.fn(),
}