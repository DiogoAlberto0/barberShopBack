import { vi } from "vitest";
import { IPreferenceRepository } from "../../../application/interfaces/repository/preferenceRepository.interface";


export const mockPreferenceRepository: IPreferenceRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findLastBy: vi.fn(),
    update: vi.fn(),
}