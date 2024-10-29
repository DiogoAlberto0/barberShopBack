import { describe, it, expect, beforeEach, Mock, vi, } from "vitest";
import { ValidateManagerUseCase } from "./validateManagerUseCase";
import { mockBearerTokenRepository } from "../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { validManager } from "../../../../test/validEntitiesFromTests/validManager";

const validateManagerUseCase = new ValidateManagerUseCase(mockBearerTokenRepository, mockManagerRepository)


describe('validate Manager use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should return an id user', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'manager' }, isValid: true });
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const token = 'sasdfasdfasdfasdf'

        const { id } = await validateManagerUseCase.execute({ token })


        expect(id).toEqual('123')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockManagerRepository.findById).toBeCalledWith('123')
    })

    it('throw if a role of user is not manager', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'barber' }, isValid: true });

        const token = 'sasdfasdfasdfasdf'

        const request = validateManagerUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockManagerRepository.findById).not.toBeCalledWith('123')
    })
    it('throw if a invalid token is informed ', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockRejectedValue(new Error('Invalid Token Provided'));

        const token = 'sasdfasdfasdfasdf'

        const request = validateManagerUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockManagerRepository.findById).not.toBeCalledWith('123')
    })

    it('throw if a valid token is provided but the barber is not in database', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'manager' }, isValid: true });
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const token = 'sasdfasdfasdfasdf'

        const request = validateManagerUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockManagerRepository.findById).toBeCalledWith('123')
    })


})