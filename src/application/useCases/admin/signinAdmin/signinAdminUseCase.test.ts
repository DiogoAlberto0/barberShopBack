import { describe, it, expect, beforeEach, Mock, vi } from "vitest";
import { SigninAdminUseCase } from "./signinAdminUseCase";

import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { mockAdminRepository } from "../../../../test/unit/vitestMockRepositories/mockAdminRepository";
import { mockBearerTokenRepository } from "../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository";

import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";

const signinUseCase = new SigninAdminUseCase(mockAdminRepository, mockBearerTokenRepository)

describe('signin admin use case tests', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

    it('should be possible to signin', async () => {
        (mockAdminRepository.findByPhone as Mock).mockResolvedValue(validBarber);
        (mockBearerTokenRepository.generateToken as Mock).mockResolvedValue({ token: '12345' });

        const { token } = await signinUseCase.execute({
            password: validPassword,
            phone: validAdmin.phone.phoneNumber
        })

        expect(token).toEqual('12345')
        expect(mockAdminRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).toHaveBeenCalledWith({ id: validBarber.id, role: 'admin' })
    })

    it('should throw if an invalid phone is informed', async () => {
        (mockAdminRepository.findByPhone as Mock).mockResolvedValue(undefined);

        const request = signinUseCase.execute({
            password: '123456789Abc.',
            phone: '61986548270'
        })

        await expect(request).rejects.toThrow('Telefone ou senha inválidos')
        expect(mockAdminRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'admin' })
    })

    it('should throw if an invalid phone is informed', async () => {
        (mockAdminRepository.findByPhone as Mock).mockResolvedValue(validBarber);

        const request = signinUseCase.execute({
            password: '123456789Abc',
            phone: '61986548270'
        })

        await expect(request).rejects.toThrow('Telefone ou senha inválidos')
        expect(mockAdminRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'admin' })
    })


})