import { describe, expect, it, vi, beforeEach, Mock } from 'vitest'

// entities
import { Barber } from '../../../../domain/Entities/Barber';

// mockRepository
import { mockBarberRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberRepository';
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository';
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository';

// use case


//valid data from tests
import { CreateBarberUseCase } from './createBarberUseCase';
import { validBarberShop, validBarberShopContractExpirated } from '../../../../test/validEntitiesFromTests/validBarberShop';
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager';



const createBarberUseCase = new CreateBarberUseCase(
    mockBarberRepository,
    mockBarberShopRepository,
    mockManagerRepository
)

describe('create barber use case tests', () => {


    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    })

    it('should possible to create a new barber', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = await createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        expect(result).toHaveProperty('barberId')
        expect(mockBarberRepository.create).toBeCalledWith(expect.any(Barber))
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('should throw if a barber shop contract expiration is less then now', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShopContractExpirated);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Seu contrato expirou favor contatar o admin')
        expect(mockBarberRepository.create).not.toBeCalledWith(expect.any(Barber))
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('should throw if have a invalid barber shop id', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Estabelecimento não encontrado')
        // expect(mockBarberRepository.create).toBeCalledWith(expect.any(Barber))
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('should throw if have a invalid manager id', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Usuário não encontrado')
        // expect(mockBarberRepository.create).toBeCalledWith(expect.any(Barber))
        // expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('should throw if manager is not from barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('shold throw if phone number is already in use', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Telefone já cadastrado')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('shold throw if exists an barber with the same CPF', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isCPFInUse as Mock).mockResolvedValue(true);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('CPF já cadastrado')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('shold throw if exists an barber with the same name', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.isNameInUse as Mock).mockResolvedValue(true);

        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Nome já cadastrado')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })

    it('shold throw if a quantity of barber is more then the limit', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberRepository.countBarbersFromBarberShop as Mock).mockResolvedValue(11);


        const result = createBarberUseCase.execute({
            name: 'Diogo',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.',
            barberShopId: '123',
            managerId: '1234'
        })

        await expect(result).rejects.toThrow('Quantidade de funcionários exedida')
        expect(mockBarberShopRepository.findById).toBeCalledWith('123')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
    })


})