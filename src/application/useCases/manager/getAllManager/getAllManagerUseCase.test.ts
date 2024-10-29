import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

// use case
import { GetAllManagerUseCase } from "./getAllManagerUseCase";

// contracts

// entities 
import { Manager } from "../../../../domain/Entities/Manager";

//value objects
import { Password } from "../../../../domain/valueObjects/Password/Password";

// valid data from tests
import { validCPF, validPhone } from "../../../../test/validEntitiesFromTests/validEntitiesFromTests";
import { mockManagerRepository } from "../../../../test/unit/vitestMockRepositories/mockManagerRepository";

describe('GetAllManagerUseCase', () => {

    const getAllManagerUseCase = new GetAllManagerUseCase(mockManagerRepository);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return a list of managers', async () => {
        const managers = [
            Manager.with({
                id: '1',
                name: 'Diogo Alberto',
                phone: validPhone,
                cpf: validCPF,
                password: Password.create('123456789Abc.')
            }),
            Manager.with({
                id: '1',
                name: 'Diogo Alberto',
                phone: validPhone,
                cpf: validCPF,
                password: Password.create('123456789Abc.')
            })
        ];

        (mockManagerRepository.list as Mock).mockResolvedValue(managers);

        (mockManagerRepository.count as Mock).mockResolvedValue(50)

        const result = await getAllManagerUseCase.execute({ page: 1, pageSize: 2 });

        expect(result.managers).toEqual(managers);
        expect(mockManagerRepository.list).toHaveBeenCalled();
        expect(result.managers).toHaveLength(2);
        expect(result.total).toBe(50);
    });

    it('should return an empty list if there are no managers', async () => {
        (mockManagerRepository.list as Mock).mockResolvedValue([]);
        (mockManagerRepository.count as Mock).mockResolvedValue(0)

        const result = await getAllManagerUseCase.execute({ page: 1, pageSize: 2 });

        expect(result.managers).toEqual([]);
        expect(mockManagerRepository.list).toHaveBeenCalled();
        expect(result.managers).toHaveLength(0);
        expect(result.total).toBe(0);
    });
});
