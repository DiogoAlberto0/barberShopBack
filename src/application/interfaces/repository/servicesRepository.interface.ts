import { Service } from "../../../domain/Entities/Service";



export interface IServiceRepository {
    create(service: Service): Promise<void>;
    findById(id: string): Promise<Service | undefined>;
    update(service: Service): Promise<void>;
    findByBarberShop(barberShopId: string): Promise<Service[]>;
    findByName(name: string): Promise<Service[]>;
    findByNameAndBarberShop(name: string, barberShopId: string): Promise<Service | undefined>;
    delete(id: string): Promise<void>;
}