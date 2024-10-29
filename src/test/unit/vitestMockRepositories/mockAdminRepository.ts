import { vi } from "vitest";
import { IAdminRepository } from "../../../application/interfaces/repository/adminRepository.interface";


export const mockAdminRepository: IAdminRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findByPhone: vi.fn(),
    isCPFInUse: vi.fn(),
    isNameInUse: vi.fn(),
    isPhoneInUse: vi.fn(),
}