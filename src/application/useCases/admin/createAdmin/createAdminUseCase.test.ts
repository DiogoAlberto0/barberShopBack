import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

// use case
import { CreateAdminUseCase } from "./createAdminUseCase";

// entities
import { Admin } from "../../../../domain/Entities/Admin";

// value objects
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { mockAdminRepository } from "../../../../test/unit/vitestMockRepositories/mockAdminRepository";

describe('create admin use case tests', () => {

    const createAdminUseCase = new CreateAdminUseCase(mockAdminRepository);

    beforeEach(() => {
        vi.clearAllMocks(); // Limpa o histórico de todos os mocks
        vi.resetAllMocks(); // Redefine todos os mocks para o estado inicial
    });

    it('should be possible to create new Admin', async () => {
        (mockAdminRepository.isNameInUse as Mock).mockResolvedValue(false);
        (mockAdminRepository.isPhoneInUse as Mock).mockResolvedValue(false);
        (mockAdminRepository.isCPFInUse as Mock).mockResolvedValue(false);
        (mockAdminRepository.create as Mock).mockResolvedValue({ id: '123' });

        const response = await createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        expect(response).toHaveProperty('id');
        expect(mockAdminRepository.isNameInUse).toHaveBeenCalledWith('diogo alberto');
        expect(mockAdminRepository.isPhoneInUse).toHaveBeenCalledWith(expect.any(Phone));
        expect(mockAdminRepository.isCPFInUse).toHaveBeenCalledWith(expect.any(CPF));
        expect(mockAdminRepository.create).toHaveBeenCalledWith(expect.any(Admin));
    });

    it('should not be possible to create new Admin with an invalid phone number', async () => {
        const response = createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '9865482',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('Telefone inválido');
        expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Admin with an invalid CPF', async () => {
        const response = createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817101',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('CPF inválido');
        expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Admin with an invalid password', async () => {
        const response = createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789'
        });

        await expect(response).rejects.toThrow('A senha deve conter no minimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial');
        expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Admin with an existent name', async () => {
        (mockAdminRepository.isNameInUse as Mock).mockResolvedValue(true);

        const response = createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('Nome já cadastrado');
        expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Admin with an existent phone number', async () => {
        (mockAdminRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        const response = createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('Telefone já cadastrado');
        expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Admin with an existent CPF', async () => {
        (mockAdminRepository.isCPFInUse as Mock).mockResolvedValue(true);

        const response = createAdminUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('CPF já cadastrado');
        expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });
});
