import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const resetDb = async () => {
    await prisma.$transaction([
        prisma.preference.deleteMany(),
        prisma.appointment.deleteMany(),
        prisma.dayOff.deleteMany(),
        prisma.service.deleteMany(),
        prisma.holiday.deleteMany(),
        prisma.barberShop.deleteMany(),
        prisma.customer.deleteMany(),
        prisma.operation.deleteMany(),
        prisma.user.deleteMany(),
        prisma.address.deleteMany(),
    ])
}