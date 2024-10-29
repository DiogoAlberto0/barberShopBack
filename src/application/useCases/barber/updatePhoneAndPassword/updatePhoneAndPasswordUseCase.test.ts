// Test Framework
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// Use Case
import { UpdatePhoneAndPasswordUseCase } from './updatePhoneAndPasswordUseCase';

// Entities

// Value Objects
import { Phone } from '../../../../domain/valueObjects/Phone/Phone';
import { Password } from '../../../../domain/valueObjects/Password/Password';

//valid data from tests
import { mockBarberRepository } from '../../../../test/unit/vitestMockRepositories/mockBarberRepository';
import { validBarber } from '../../../../test/validEntitiesFromTests/validBarber';



// Test Suite
describe('UpdatePhoneAndPasswordUseCase', () => {
    let updatePhoneAndPasswordUseCase: UpdatePhoneAndPasswordUseCase;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();

        updatePhoneAndPasswordUseCase = new UpdatePhoneAndPasswordUseCase(
            mockBarberRepository
        );
    });

    it('should successfully update the phone and password of the barber', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);

        const newPhone = '61912345678';
        const newPassword = 'NewPassword123!';

        const result = updatePhoneAndPasswordUseCase.execute({
            barberId: '1',
            newPhone,
            newPassword,
        });

        const updatedBarber = {
            id: validBarber.id,
            name: validBarber.name,
            phone: new Phone(newPhone),
            password: Password.create(newPassword),
            barberShop: validBarber.barberShop,
            cpf: validBarber.cpf,
        };

        await expect(result).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toBeCalledWith('1')
        expect(mockBarberRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            id: updatedBarber.id,
            name: updatedBarber.name,
            phone: expect.objectContaining({ phoneNumber: newPhone }),
            password: expect.objectContaining({ hash: expect.any(String) }),
            barberShop: updatedBarber.barberShop,
            cpf: updatedBarber.cpf,
        }));

    });


    it('should throw an error if the barber is not found', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(undefined);

        await expect(
            updatePhoneAndPasswordUseCase.execute({
                barberId: '1',
                newPhone: '61912345678',
                newPassword: 'NewPassword123!',
            })
        ).rejects.toThrow('Funcionário não encontrado');
    });
});
