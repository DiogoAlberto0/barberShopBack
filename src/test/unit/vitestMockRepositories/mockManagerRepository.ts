import { vi } from "vitest";
import { IManagerRepository } from "../../../application/interfaces/repository/managerRepository.interface";



export const mockManagerRepository: IManagerRepository = {
    count: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    findByCPF: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    findByPhone: vi.fn(),
    isCPFInUse: vi.fn(),
    isNameInUse: vi.fn(),
    isPhoneInUse: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
}