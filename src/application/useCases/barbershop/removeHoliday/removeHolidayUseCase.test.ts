import { describe, expect, it, Mock } from "vitest";
import { RemoveHolidayUseCase } from "./removeHolidayUseCase";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";


describe('remove holiday use case tests', () => {

    const removeHolidayUseCase = new RemoveHolidayUseCase(mockManagerRepository, mockBarberShopRepository)

    const date = new Date()

    it('should be possible to remove an existent holiday', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);


        const response = removeHolidayUseCase.execute({
            barberShopId: '1234',
            managerId: '123',
            date,
        })

        await expect(response).resolves.not.toThrow()
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.deleteHoliday).toHaveBeenCalledWith('1234', new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    })

    it('should throw if a not existent holiday date is provided', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockBarberShopRepository.deleteHoliday as Mock).mockImplementationOnce(() => { throw new Error('Feriado não encontrado') });


        const response = removeHolidayUseCase.execute({
            barberShopId: '1234',
            managerId: '123',
            date,
        })

        await expect(response).rejects.toThrow('Feriado não encontrado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.deleteHoliday).toHaveBeenCalledWith('1234', new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    })

    it('should throw if barberShopId is not found', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);


        const response = removeHolidayUseCase.execute({
            barberShopId: '1234',
            managerId: '123',
            date,
        })

        await expect(response).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.deleteHoliday).toHaveBeenCalledWith('1234', new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    })


    it('should throw if invalid manager id is provided', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);


        const response = removeHolidayUseCase.execute({
            barberShopId: '1234',
            managerId: '123',
            date,
        })

        await expect(response).rejects.toThrow('Usuário não autorizado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.deleteHoliday).toHaveBeenCalledWith('1234', new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    })

    it('should throw if manager is not from barber shop', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);


        const response = removeHolidayUseCase.execute({
            barberShopId: '1234',
            managerId: '123',
            date,
        })

        await expect(response).rejects.toThrow('Usuário não autorizado')
        expect(mockManagerRepository.findById).toHaveBeenCalledWith('123')
        expect(mockBarberShopRepository.findById).toHaveBeenCalledWith('1234')
        expect(mockBarberShopRepository.deleteHoliday).toHaveBeenCalledWith('1234', new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    })
})