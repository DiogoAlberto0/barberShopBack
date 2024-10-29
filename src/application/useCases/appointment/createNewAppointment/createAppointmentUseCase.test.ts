import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from "vitest";
import { CreateNewAppointmentUseCase } from "./createAppointmentUseCase";
import { mockBarberShopRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberShopRepository";
import { mockBarberRepository } from "../../../../test/unit/vitestMockRepositories/mockBarberRepository";
import { mockServiceRepository } from "../../../../test/unit/vitestMockRepositories/mockServiceRepository";
import { mockAppointmentRepository } from "../../../../test/unit/vitestMockRepositories/mockAppointmentRepository";
import { validBarber } from "../../../../test/validEntitiesFromTests/validBarber";
import { validBarberShop } from "../../../../test/validEntitiesFromTests/validBarberShop";
import { validCustomer } from "../../../../test/validEntitiesFromTests/validCustomer";
import { validService } from "../../../../test/validEntitiesFromTests/validService";
import { Phone } from "../../../../domain/valueObjects/Phone/Phone";
import { CPF } from "../../../../domain/valueObjects/CPF/CPF";
import { Appointment } from "../../../../domain/Entities/Appointment";
import { validAppointment } from "../../../../test/validEntitiesFromTests/validAppointments";
import { Holiday } from "../../../../domain/Entities/Holiday";
import { Time } from "../../../../domain/valueObjects/Time/Time";
import { DayOff } from "../../../../domain/Entities/DayOff";



function getNextDayOfWeek(date: Date, dayOfWeek: number) {
    const resultDate = new Date(date);
    const currentDay = resultDate.getDay();
    const daysUntilNext = (dayOfWeek + 7 - currentDay) % 7;
    resultDate.setDate(resultDate.getDate() + daysUntilNext);
    return resultDate;

}

const validDate = getNextDayOfWeek(new Date(), 1)

const invalidBarberDate = getNextDayOfWeek(new Date(), 6)

const invalidBarberShopDate = getNextDayOfWeek(new Date(), 0)

const customerData = {
    customerName: validCustomer.name,
    customerCPF: validCustomer.cpf.cleaned,
    customerPhone: validCustomer.phone.phoneNumber
}

const serviceData = {
    barberShopId: validBarberShop.id,
    barberId: validBarber.id,
    serviceId: validService.id
}

describe('create appointment controller tests', () => {

    const createAppointmentUseCase = new CreateNewAppointmentUseCase(mockBarberShopRepository, mockBarberRepository, mockServiceRepository, mockAppointmentRepository)

    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()


    })

    it('should be possible to create a new appointment', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should be possible to create a new appointment at exact open time', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should throw error if dont have time to finish service', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 21,
                minute: 30
            },
        })

        await expect(promise).rejects.toThrow('Horário de término do agendamento ultrapassa o horário de funcionamento do estabelecimento')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber already have appoinmtent in that date"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([validAppointment]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('O funcionário já possui um agendamento neste horário')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber unavaliable in this time"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 21,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Funcionário indisponivel neste horário')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber unavaliable in this week day"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: invalidBarberDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Barberiro indisponivel neste dia da semana')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, invalidBarberDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber unavaliable in this date" if barber have an dayoff in this date', async () => {

        const dayoff = getNextDayOfWeek(new Date(), 2);
        validBarber.addDayOff(dayoff);

        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: dayoff,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Funcionário indisponivel nesta data')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, dayoff)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber shop unavaliable in this date" if barber have an holiday in this date and is closed', async () => {

        const holiday = getNextDayOfWeek(new Date(), 2);
        validBarberShop.addHoliday(new Holiday({
            date: holiday,
            isClosed: true,
            openTime: new Time({ hour: 0, minute: 0 }),
            closeTime: new Time({ hour: 0, minute: 0 })
        }));
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: holiday,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Estabelecimento indisponivel nesta data')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, holiday)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber shop unavaliable in this date" if barber have an holiday in this date and is not closed but is unavaliable in this time', async () => {
        const holiday = getNextDayOfWeek(new Date(), 2);
        validBarberShop.addHoliday(new Holiday({
            date: holiday,
            isClosed: false,
            openTime: new Time({ hour: 8, minute: 0 }),
            closeTime: new Time({ hour: 12, minute: 0 })
        }));
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: holiday,
            serviceId: validService.id,
            startsAt: {
                hour: 13,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Estabelecimento indisponivel neste horário')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, holiday)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should be possible to create appointment if barber have an holiday in this date and is not closed and is avaliable in this time', async () => {
        const holiday = getNextDayOfWeek(new Date(), 3);
        validBarberShop.addHoliday(new Holiday({
            date: holiday,
            isClosed: false,
            openTime: new Time({ hour: 8, minute: 0 }),
            closeTime: new Time({ hour: 12, minute: 0 })
        }));
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: holiday,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).resolves.not.toThrow()
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).toHaveBeenLastCalledWith(validBarber.id, holiday)
        expect(mockAppointmentRepository.create).toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber shop unavaliable in this week day"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: invalidBarberShopDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Estabelecimento indisponivel neste dia da semana')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, invalidBarberShopDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber shop unavaliable in this time"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 22,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Estabelecimento indisponivel neste horário')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "invalid CPF"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: '12345678901',
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('CPF inválido')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).not.toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "invalid phone number"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: '619999999',
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Telefone inválido')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).not.toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "invalid hour"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 25,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('As horas devem estar entre 00 e 23')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "invalid minute"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 20,
                minute: 61
            },
        })

        await expect(promise).rejects.toThrow('Os minutos devem estar entre 00 e 59')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber shop not found"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(null);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Estabelecimento não encontrado')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).not.toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).not.toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "barber not found"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(null);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(validService);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Funcionário não encontrado')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).not.toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).not.toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).not.toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

    it('should return message "service is not found"', async () => {
        (mockBarberRepository.findById as Mock).mockResolvedValue(validBarber);
        (mockBarberShopRepository.findById as Mock).mockResolvedValue(validBarberShop);
        (mockServiceRepository.findById as Mock).mockResolvedValue(null);
        (mockAppointmentRepository.findCustomer as Mock).mockResolvedValue(validCustomer);
        (mockAppointmentRepository.findByBarberAndDate as Mock).mockResolvedValue([]);


        const promise = createAppointmentUseCase.execute({
            barberId: validBarber.id,
            barberShopId: validBarberShop.id,
            customerCPF: validCustomer.cpf.cleaned,
            customerName: validCustomer.name,
            customerPhone: validCustomer.phone.phoneNumber,
            date: validDate,
            serviceId: validService.id,
            startsAt: {
                hour: 8,
                minute: 0
            },
        })

        await expect(promise).rejects.toThrow('Serviço não encontrado')
        expect(mockBarberRepository.findById).toHaveBeenLastCalledWith(validBarber.id)
        expect(mockBarberShopRepository.findById).toHaveBeenLastCalledWith(validBarberShop.id)
        expect(mockServiceRepository.findById).toHaveBeenLastCalledWith(validService.id)
        expect(mockAppointmentRepository.findCustomer).not.toHaveBeenLastCalledWith(validCustomer.name, expect.any(Phone), expect.any(CPF))
        expect(mockAppointmentRepository.findByBarberAndDate).not.toHaveBeenLastCalledWith(validBarber.id, validDate)
        expect(mockAppointmentRepository.create).not.toHaveBeenCalledWith(expect.any(Appointment))
    })

}) 