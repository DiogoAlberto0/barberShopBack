import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { CreateNewServiceUseCase } from "./createServiceUseCase";
import { Service } from "../../../../domain/Entities/Service";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";
import { mockServiceRepository } from "../../../../test/unit/vitestMockRepositories/mockServiceRepository";
import { validBarberShop, validBarberShopContractExpirated } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validManager, validManager2 } from "../../../../test/validEntitiesFromTests/validManager";
import { validService } from "../../../../test/validEntitiesFromTests/validService";


const createServiceUseCase = new CreateNewServiceUseCase(mockServiceRepository, mockBarberShopRepository, mockManagerRepository)
describe('create service use case tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })


    it('should throw an error if a invalid barber shop id is provided', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);

        const result = createServiceUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 60
        })

        await expect(result).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockServiceRepository.create).not.toBeCalled()

    })

    it('should throw an error if a name service already in use for the same barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(validService);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = createServiceUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 60
        })

        await expect(result).rejects.toThrow('Serviço já cadastrado')
        expect(mockServiceRepository.create).not.toBeCalled()

    })

    it('should throw an error if a invalid price is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = createServiceUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: -10,
            timeInMinutes: 60
        })

        await expect(result).rejects.toThrow('O preço deve ser um número positivo')
        expect(mockServiceRepository.create).not.toBeCalled()

    })

    it('should create a service', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = createServiceUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 60
        })

        await expect(result).resolves.not.toThrow('')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockServiceRepository.findByNameAndBarberShop).toBeCalledWith('Corte simples', '123')
        expect(mockServiceRepository.create).toBeCalledWith(expect.any(Service))
        expect(mockServiceRepository.create).toBeCalledTimes(1)

    })

    it('should throw if barber shop contract expirated by more then 1 month', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShopContractExpirated);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = createServiceUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 60
        })

        await expect(result).rejects.toThrow('Seu contrato expirou, favor contatar o ADM')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockServiceRepository.findByNameAndBarberShop).toBeCalledWith('Corte simples', '123')
        expect(mockServiceRepository.create).not.toBeCalledWith(expect.any(Service))
        expect(mockServiceRepository.create).not.toBeCalledTimes(1)

    })

    it('should throw if an invalid manager id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const result = createServiceUseCase.execute({
            managerId: '',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 60
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findById).not.toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('')
        expect(mockServiceRepository.findByNameAndBarberShop).not.toBeCalledWith('Corte simples', '123')
        expect(mockServiceRepository.create).not.toBeCalledWith(expect.any(Service))
    })

    it('should throw if manager is not from barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findByNameAndBarberShop as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        const result = createServiceUseCase.execute({
            managerId: '1234',
            barberShopId: '123',
            name: 'Corte simples',
            description: 'lorem ipsum dolor amiet',
            price: 50,
            timeInMinutes: 60
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
        expect(mockServiceRepository.findByNameAndBarberShop).not.toBeCalledWith('Corte simples', '123')
        expect(mockServiceRepository.create).not.toBeCalledWith(expect.any(Service))
    })
})