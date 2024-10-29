import { describe, it, expect, beforeEach, Mock, vi } from "vitest";
import { SigninManagerUseCase } from "./signinManagerUseCase";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { mockBearerTokenRepository } from "../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";

const signinUseCase = new SigninManagerUseCase(mockManagerRepository, mockBearerTokenRepository)

describe('signin barber use case tests', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

    it('should be possible to signin', async () => {
        (mockManagerRepository.findByPhone as Mock).mockResolvedValue(validBarber);
        (mockBearerTokenRepository.generateToken as Mock).mockResolvedValue({ token: '12345' });

        const { token } = await signinUseCase.execute({
            password: validPassword,
            phone: '61986548270'
        })

        expect(token).toEqual('12345')
        expect(mockManagerRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).toHaveBeenCalledWith({ id: validBarber.id, role: 'manager' })
    })

    it('should throw if an invalid phone is informed', async () => {
        (mockManagerRepository.findByPhone as Mock).mockResolvedValue(undefined);

        const request = signinUseCase.execute({
            password: '123456789Abc.',
            phone: '61986548270'
        })

        await expect(request).rejects.toThrow('Telefone ou senha inválidos')
        expect(mockManagerRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'manager' })
    })

    it('should throw if an invalid phone is informed', async () => {
        (mockManagerRepository.findByPhone as Mock).mockResolvedValue(validBarber);

        const request = signinUseCase.execute({
            password: '123456789Abc',
            phone: '61986548270'
        })

        await expect(request).rejects.toThrow('Telefone ou senha inválidos')
        expect(mockManagerRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'manager' })
    })


})