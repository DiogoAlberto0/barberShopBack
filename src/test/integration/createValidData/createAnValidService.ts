import { validService, validService2 } from "../../validEntitiesFromTests/validService"
import { testPrismaClient } from "../prisma"

export const createAnValidService = async () => {
    await testPrismaClient.service.create({
        data: {
            id: validService.id,
            name: validService.name,
            price: validService.price.getValue(),
            description: validService.description,
            timeInMinutes: validService.timeInMinutes,
            isActive: true,
            barberShopId: validService.barberShopId,
        }
    })
}

export const createAnValidInactiveService = async () => {
    await testPrismaClient.service.create({
        data: {
            id: validService2.id,
            name: validService2.name,
            price: validService2.price.getValue(),
            description: validService2.description,
            timeInMinutes: validService2.timeInMinutes,
            isActive: false,
            barberShopId: validService2.barberShopId,
        }
    })
}