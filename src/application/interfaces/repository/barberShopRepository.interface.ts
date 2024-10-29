import { BarberShop } from "../../../domain/Entities/BarberShop";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";
import { Address } from "../../../domain/valueObjects/Address/Address";



export interface IBarberShopRepository {
    create(barberShop: BarberShop): Promise<void>
    update(barberShop: BarberShop): Promise<void>
    findById(id: string): Promise<BarberShop | undefined>
    findByPhone(phone: Phone): Promise<BarberShop | undefined>
    findByName(name: string): Promise<BarberShop | undefined>
    isAddressInUse(address: Address): Promise<boolean>
    list(options?: { skip?: number, limit?: number, country?: string, state?: string, city?: string, neighborhood?: string }): Promise<BarberShop[]>
    delete(id: string): Promise<void>
    deleteHoliday(barberShopId: string, date: Date): Promise<void>
}