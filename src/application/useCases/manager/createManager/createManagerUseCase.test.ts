import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

// use case
import { CreateManagerUseCase } from "./createManagerUseCase";

// contracts

// entities
import { Manager } from "../../../../domain/Entities/Manager";

// value objects
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";

describe('create manager use case tests', () => {

    const createManagerUseCase = new CreateManagerUseCase(mockManagerRepository);

    beforeEach(() => {
        vi.clearAllMocks(); // Limpa o histórico de todos os mocks
        vi.resetAllMocks(); // Redefine todos os mocks para o estado inicial
    });

    it('should be possible to create new Manager', async () => {
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.create as Mock).mockResolvedValue({ id: '123' });

        const response = await createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        expect(response).toHaveProperty('id');
        expect(mockManagerRepository.isNameInUse).toHaveBeenCalledWith('diogo alberto');
        expect(mockManagerRepository.isPhoneInUse).toHaveBeenCalledWith(expect.any(Phone));
        expect(mockManagerRepository.isCPFInUse).toHaveBeenCalledWith(expect.any(CPF));
        expect(mockManagerRepository.create).toHaveBeenCalledWith(expect.any(Manager));
    });

    it('should not be possible to create new Manager with an invalid phone number', async () => {
        const response = createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '9865482',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('Telefone inválido');
        expect(mockManagerRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Manager with an invalid CPF', async () => {
        const response = createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817101',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('CPF inválido');
        expect(mockManagerRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Manager with an invalid password', async () => {
        const response = createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789'
        });

        await expect(response).rejects.toThrow('A senha deve conter no minimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial');
        expect(mockManagerRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Manager with an existent name', async () => {
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(true);

        const response = createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('Nome já cadastrado');
        expect(mockManagerRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Manager with an existent phone number', async () => {
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        const response = createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('Telefone já cadastrado');
        expect(mockManagerRepository.create).not.toHaveBeenCalled();
    });

    it('should not be possible to create new Manager with an existent CPF', async () => {
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(true);

        const response = createManagerUseCase.execute({
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        await expect(response).rejects.toThrow('CPF já cadastrado');
        expect(mockManagerRepository.create).not.toHaveBeenCalled();
    });
});
