import { describe, it, expect, beforeEach, Mock, vi, } from "vitest";
import { ValidateBarberUseCase } from "./validateBarberUseCase";
import { mockBarberRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockBearerTokenRepository } from "../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";

const validateBarberUseCase = new ValidateBarberUseCase(mockBearerTokenRepository, mockBarberRepository)


describe('validate Barber use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should return an id user', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'barber' }, isValid: true });
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        const token = 'sasdfasdfasdfasdf'

        const { id } = await validateBarberUseCase.execute({ token })


        expect(id).toEqual('123')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockBarberRepository.findById).toBeCalledWith('123')
    })

    it('throw if a role of user is not barber', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'manager' }, role: 'manager', isValid: true });

        const token = 'sasdfasdfasdfasdf'

        const request = validateBarberUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockBarberRepository.findById).not.toBeCalledWith('123')
    })
    it('throw if a invalid token is informed ', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockRejectedValue(new Error('Invalid Token Provided'));

        const token = 'sasdfasdfasdfasdf'

        const request = validateBarberUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockBarberRepository.findById).not.toBeCalledWith('123')
    })

    it('throw if a valid token is provided but the barber is not in database', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'barber' }, isValid: true });
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);

        const token = 'sasdfasdfasdfasdf'

        const request = validateBarberUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockBarberRepository.findById).toBeCalledWith('123')
    })


})