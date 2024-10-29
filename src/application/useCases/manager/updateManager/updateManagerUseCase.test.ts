import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

// use case
import { UpdateManagerUseCase } from "./updateManagerUseCase";

// contracts

//entities
import { Manager } from "../../../../domain/Entities/Manager";
import { Password } from "../../../../domain/valueObjects/Password/Password";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { validManager } from "../../../../test/validEntitiesFromTests/validManager";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";

describe('UpdateManagerUseCase', () => {

    const updateManagerUseCase = new UpdateManagerUseCase(mockManagerRepository);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update a manager successfully', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(false);

        await updateManagerUseCase.execute({
            id: '1',
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        });

        expect(mockManagerRepository.update).toHaveBeenCalled();
        expect((mockManagerRepository.update as Mock).mock.calls[0][0]).toBeInstanceOf(Manager);
    });

    it('should throw an error if name already exists with different id', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(true);

        await expect(updateManagerUseCase.execute({
            id: '1',
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        })).rejects.toThrow('Nome já cadastrado');
    });

    it('should throw an error if CPF already exists with different id', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(true);

        await expect(updateManagerUseCase.execute({
            id: '1',
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '70157162168',
            password: '123456789Abc.'
        })).rejects.toThrow('CPF já cadastrado');
    });

    it('should throw an error if phone already exists with different id', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        await expect(updateManagerUseCase.execute({
            id: '1',
            name: 'Diogo Alberto',
            phone: '61986548271',
            cpf: '07156817108',
            password: '123456789Abc.'
        })).rejects.toThrow('Telefone já cadastrado');
    });

    it('should not throw an error if name, CPF, and phone exist but belong to the same manager', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(validManager);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(true);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(true);
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        await expect(updateManagerUseCase.execute({
            id: validManager.id,
            name: validManager.name,
            phone: validManager.phone.phoneNumber,
            cpf: validManager.cpf.cleaned,
            password: '123456789Abc.'
        })).resolves.not.toThrow();

        expect(mockManagerRepository.update).toHaveBeenCalled();
    });

    it('should throw an error if not exist user with informed id', async () => {
        (mockManagerRepository.findById as Mock).mockResolvedValue(undefined);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(true);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(true);
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(true);

        await expect(updateManagerUseCase.execute({
            id: '1',
            name: 'Diogo Alberto',
            phone: '61986548270',
            cpf: '07156817108',
            password: '123456789Abc.'
        })).rejects.toThrow('Usuário não encontrado');
    });

    it('deve atualizar o gerente sem alterar a senha quando nenhuma nova senha é fornecida', async () => {
        const senhaOriginal = 'senhaOriginal123!@#';
        const managerOriginal = {
            ...validManager,
            password: Password.create(senhaOriginal)
        };

        (mockManagerRepository.findById as Mock).mockResolvedValue(managerOriginal);
        (mockManagerRepository.isNameInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isCPFInUse as Mock).mockResolvedValue(false);
        (mockManagerRepository.isPhoneInUse as Mock).mockResolvedValue(false);

        await updateManagerUseCase.execute({
            id: '1',
            name: 'Novo Nome',
            phone: '61986548270',
            cpf: '07156817108',
            password: '' // Senha vazia para simular nenhuma nova senha fornecida
        });

        expect(mockManagerRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: '1',
                name: 'novo nome',
                phone: expect.any(Phone),
                cpf: expect.any(CPF),
                password: expect.objectContaining({
                    compare: expect.any(Function)
                })
            })
        );

        const managerAtualizado = (mockManagerRepository.update as Mock).mock.calls[0][0];
        expect(managerAtualizado.password.compare(senhaOriginal)).toBe(true);
    });
});
