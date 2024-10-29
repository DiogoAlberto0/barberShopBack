import { describe, it, expect, beforeEach, Mock, vi, } from "vitest";
import { ValidateAdminUseCase } from "./validateAdmin";

import { mockBearerTokenRepository } from "../../../../test/unit/vitestMockRepositories/mockBearerTokenRepository";
import { mockAdminRepository } from "../../../../test/unit/vitestMockRepositories/mockAdminRepository";
import { validAdmin } from "../../../../test/validEntitiesFromTests/validAdmin";

const validateAdminUseCase = new ValidateAdminUseCase(mockBearerTokenRepository, mockAdminRepository)


describe('validate Admin use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should return an id user', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'admin' }, isValid: true });
        (mockAdminRepository.findById as Mock).mockResolvedValue(validAdmin);

        const token = 'sasdfasdfasdfasdf'

        const { id } = await validateAdminUseCase.execute({ token })


        expect(id).toEqual('123')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockAdminRepository.findById).toBeCalledWith('123')
    })

    it('throw if a role of user is not admin', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'barber' }, isValid: true });

        const token = 'sasdfasdfasdfasdf'

        const request = validateAdminUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockAdminRepository.findById).not.toBeCalledWith('123')
    })
    it('throw if a invalid token is informed ', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockRejectedValue(new Error('Invalid Token Provided'));

        const token = 'sasdfasdfasdfasdf'

        const request = validateAdminUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockAdminRepository.findById).not.toBeCalledWith('123')
    })

    it('throw if a valid token is provided but the barber is not in database', async () => {
        (mockBearerTokenRepository.decodeToken as Mock).mockResolvedValue({ payload: { id: '123', role: 'admin' }, isValid: true });
        (mockAdminRepository.findById as Mock).mockResolvedValue(undefined);

        const token = 'sasdfasdfasdfasdf'

        const request = validateAdminUseCase.execute({ token })


        await expect(request).rejects.toThrow('Usuário não autorizado')
        expect(mockBearerTokenRepository.decodeToken).toBeCalledWith(token)
        expect(mockAdminRepository.findById).toBeCalledWith('123')
    })


})