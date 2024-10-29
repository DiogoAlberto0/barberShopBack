import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

//use case
import { UpdateBarberShopUseCase } from './updateBarberShopUseCase'

//entities
import { BarberShop } from '../../../../domain/Entities/BarberShop'

//value objects
import { Phone } from '../../../../domain/valueObjects/Phone/Phone'

// valid data from tests
import { mockBarberShopRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberShopRepository'
import { mockManagerRepository } from '../../../../test/unit/vitestMockRepositories/mockManagerRepository'
import { validAddress, validAddress2 } from '../../../../test/validEntitiesFromTests/validAddress'
import { validBarberShop, validBarberShopContractExpirated } from '../../../../test/validEntitiesFromTests/validBarberShop'
import { validManager, validManager2 } from '../../../../test/validEntitiesFromTests/validManager'

const updateBarberShopUseCase = new UpdateBarberShopUseCase(mockBarberShopRepository, mockManagerRepository)


describe('update barber shop use case test', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })

    it('should be possible to update an existent barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);


        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: '123'
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberShopRepository.findByName).toBeCalledWith('Diogo Barber shop')
        expect(mockBarberShopRepository.findByPhone).toBeCalledWith(expect.any(Phone))
        expect(mockBarberShopRepository.update).toBeCalledWith(expect.any(BarberShop))
    })

    it('should throw if barber shop have contract expirated more then 1 month', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShopContractExpirated);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);


        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: '123'
        })

        await expect(result).rejects.toThrow('Seu contrato expirou favor contatar o admin')
        expect(mockBarberShopRepository.findByName).toBeCalledWith('Diogo Barber shop')
        expect(mockBarberShopRepository.findByPhone).toBeCalledWith(expect.any(Phone))
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should throw if update an inexistent barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(null);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: '123'
        })

        await expect(result).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should throw if name already in use', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        (mockBarberShopRepository.findByName as Mock).mockResolvedValue({ id: '123' });

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: '123'
        })

        await expect(result).rejects.toThrow('Nome do estabelecimento já está em uso')
        expect(mockBarberShopRepository.findByName).toBeCalledWith('Diogo Barber shop')
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should throw if phone already in use by other barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        (mockBarberShopRepository.findByPhone as Mock).mockResolvedValue({ id: '123' });

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: '123'
        })

        await expect(result).rejects.toThrow('Telefone do estabelecimento já está em uso')
        expect(mockBarberShopRepository.findByPhone).toBeCalledWith(expect.any(Phone))
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should not throw if phone already in use but it used by the same barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        (mockBarberShopRepository.findByPhone as Mock).mockResolvedValue(validBarberShop);

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: validBarberShop.id
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberShopRepository.findByPhone).toBeCalledWith(expect.any(Phone))
        expect(mockBarberShopRepository.update).toBeCalledWith(expect.any(BarberShop))
    })

    it('should not throw if name already in use but it used by the same barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);

        (mockBarberShopRepository.findByName as Mock).mockResolvedValue(validBarberShop);

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: validBarberShop.id
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberShopRepository.findByName).toBeCalledWith('Diogo Barber shop')
        expect(mockBarberShopRepository.update).toBeCalledWith(expect.any(BarberShop))
    })

    it('should not throw if invalid manager id is provided', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);

        (mockBarberShopRepository.findByName as Mock).mockResolvedValue(validBarberShop);

        const result = updateBarberShopUseCase.execute({
            managerId: '',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: validBarberShop.id
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findByName).not.toBeCalledWith('Diogo Barber shop')
        expect(mockManagerRepository.findById).toBeCalledWith('')
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should not throw if manager is not from barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager2);

        (mockBarberShopRepository.findByName as Mock).mockResolvedValue(validBarberShop);

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: validBarberShop.id
        })

        await expect(result).rejects.toThrow('Usuário não autorizado')
        expect(mockBarberShopRepository.findByName).not.toBeCalledWith('Diogo Barber shop')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should not throw if address is already in use by other barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.isAddressInUse as Mock).mockResolvedValue(true)

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress2.props,
            barberShopId: validBarberShop.id
        })

        await expect(result).rejects.toThrow('Endereço já está em uso')
        expect(mockBarberShopRepository.findByName).toBeCalledWith('Diogo Barber shop')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
        expect(mockBarberShopRepository.update).not.toBeCalledWith(expect.any(BarberShop))
    })

    it('should be possible to update if address is from the same barber shop', async () => {
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockBarberShopRepository.isAddressInUse as Mock).mockResolvedValue(true)

        const result = updateBarberShopUseCase.execute({
            managerId: '1234',
            name: 'Diogo Barber shop',
            phone: '61986548270',
            address: validAddress.props,
            barberShopId: validBarberShop.id
        })

        await expect(result).resolves.not.toThrow()
        expect(mockBarberShopRepository.findByName).toBeCalledWith('Diogo Barber shop')
        expect(mockManagerRepository.findById).toBeCalledWith('1234')
        expect(mockBarberShopRepository.update).toBeCalledWith(expect.any(BarberShop))
    })

})