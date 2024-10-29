import { Barber } from "../../../domain/Entities/Barber";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";

export interface IBarberRepository {
    create(barber: Barber): Promise<void>
    findByName(name: string): Promise<Barber | undefined>
    findByCPF(cpf: CPF): Promise<Barber | undefined>
    findByPhone(phone: Phone): Promise<Barber | undefined>
    getBarbersByBarberShop(barberShopId: string, active?: boolean): Promise<Barber[]>
    countBarbersFromBarberShop(barberShopId: string): Promise<number>
    findById(id: string): Promise<Barber | undefined>
    update(barber: Barber): Promise<void>
    list(options?: { skip: number, limit: number }): Promise<Barber[]>
    delete(id: string): Promise<void>
    isNameInUse(name: string): Promise<boolean>
    isPhoneInUse(phone: Phone): Promise<boolean>
    isCPFInUse(cpf: CPF): Promise<boolean>
    removeDayOff(barberId: string, date: Date): Promise<void>
    addDayOff(barberId: string, date: Date): Promise<void>
    isRegisteredDayOff(barberId: string, date: Date): Promise<boolean>
}