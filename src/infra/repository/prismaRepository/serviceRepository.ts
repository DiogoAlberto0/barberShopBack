//prisma
import { convertServiceFromDBToEntity, prisma } from "./prismaClient";

//contracts
import { IServiceRepository } from "../../../application/interfaces/repository/servicesRepository.interface";

//entities
import { Service } from "../../../domain/Entities/Service";


export class PrismaServiceRepository implements IServiceRepository {
    async create(service: Service): Promise<void> {
        await prisma.service.create({
            data: {
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price.getValue(),
                timeInMinutes: service.timeInMinutes,
                barberShopId: service.barberShopId,
                isActive: true
            }
        });
    }

    async update(service: Service): Promise<void> {
        await prisma.service.update({
            where: { id: service.id },
            data: {
                name: service.name,
                description: service.description,
                price: service.price.getValue(),
                timeInMinutes: service.timeInMinutes,
                barberShopId: service.barberShopId
            }
        });
    }

    private async findUniqueServiceBy({ id, name, barberShopId }: { id?: string, name?: string, barberShopId?: string }): Promise<Service | undefined> {

        const service = await prisma.service.findFirst({
            where: { id, name, barberShopId, isActive: true }
        })

        if (!service) return undefined

        return convertServiceFromDBToEntity(service)
    }

    async findById(id: string): Promise<Service | undefined> {
        return await this.findUniqueServiceBy({ id })
    }

    async findByNameAndBarberShop(name: string, barberShopId: string): Promise<Service | undefined> {
        return await this.findUniqueServiceBy({ name, barberShopId })
    }

    private async findManyServiceBy({ name, barberShopId }: { name?: string, barberShopId?: string }): Promise<Service[]> {

        const servicesData = await prisma.service.findMany({
            where: { name, barberShopId, isActive: true }
        });
        return servicesData.map(serviceData => convertServiceFromDBToEntity(serviceData));
    }

    async findByBarberShop(barberShopId: string): Promise<Service[]> {
        return await this.findManyServiceBy({ barberShopId })
    }

    async findByName(name: string): Promise<Service[]> {
        return await this.findManyServiceBy({ name })
    }

    async delete(id: string): Promise<void> {
        await prisma.service.update({
            where: { id },
            data: {
                isActive: false
            }
        });
    }
}



