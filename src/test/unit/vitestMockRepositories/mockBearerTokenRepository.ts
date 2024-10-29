import { vi } from "vitest";
import { IBearerToken } from "../../../application/interfaces/authentication/bearerToken.interface";


export const mockBearerTokenRepository: IBearerToken = {
    decodeToken: vi.fn(),
    generateToken: vi.fn(),
}