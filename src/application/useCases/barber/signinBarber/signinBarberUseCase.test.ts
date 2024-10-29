import { describe, it, expect, beforeEach, Mock, vi } from "vitest";
import { BarberSigninUseCase } from "./signinBarberUseCase";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { mockBarberRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockBearerTokenRepository } from "../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validBarberShop, validBarberShopContractExpirated } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validPassword } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";

const signinUseCase = new BarberSigninUseCase(mockBarberRepository, mockBearerTokenRepository, mockBarberShopRepository)

describe('signin barber use case tests', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

    it('should be possible to signin', async () => {
        (mockBarberRepository.findByPhone as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBearerTokenRepository.generateToken as Mock).mockResolvedValue({ token: '12345' });


        const { token } = await signinUseCase.execute({
            password: validPassword,
            phone: validBarber.phone.phoneNumber
        })

        expect(token).toEqual('12345')
        expect(mockBarberRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).toHaveBeenCalledWith({ id: validBarber.id, role: 'barber' })
    })

    it('should throw if barber shop contract expirated more than 1 month', async () => {
        (mockBarberRepository.findByPhone as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShopContractExpirated);
        (mockBearerTokenRepository.generateToken as Mock).mockResolvedValue({ token: '12345' });


        const request = signinUseCase.execute({
            phone: validBarber.phone.phoneNumber,
            password: validPassword
        })

        await expect(request).rejects.toThrow('O contrato da sua barbearia expirou, favor contatar seu gerente')
        expect(mockBarberRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'barber' })
    })

    it('should throw if an invalid phone is informed', async () => {
        (mockBarberRepository.findByPhone as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const request = signinUseCase.execute({
            password: '123456789Abc.',
            phone: '61986548270'
        })

        await expect(request).rejects.toThrow('Telefone ou senha inválidos')
        expect(mockBarberRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'barber' })
    })

    it('should throw if an invalid phone is informed', async () => {
        (mockBarberRepository.findByPhone as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);

        const request = signinUseCase.execute({
            password: '123456789Abc',
            phone: '61986548270'
        })

        await expect(request).rejects.toThrow('Telefone ou senha inválidos')
        expect(mockBarberRepository.findByPhone).toHaveBeenCalledWith(expect.any(Phone))
        expect(mockBearerTokenRepository.generateToken).not.toHaveBeenCalledWith({ id: validBarber.id, role: 'barber' })
    })


})