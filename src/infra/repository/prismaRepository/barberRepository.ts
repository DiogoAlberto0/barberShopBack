import { PrismaClient } from "@prisma/client";
import { IBarberRepository } from "../../../application/interfaces/repository/barberRepository.interface";
import { Barber } from "../../../domain/Entities/Barber";
import { Operation } from "../../../domain/Entities/Operation";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";
import { prisma, convertBarberFromDBToEntity } from "./prismaClient";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";


export class PrismaBarberRepository implements IBarberRepository {

    async create(barber: Barber): Promise<void> {
        await prisma.user.upsert({
            where: {
                cpf: barber.cpf.cleaned
            },
            create: {
                cpf: barber.cpf.cleaned,
                hash: barber.password.getHash(),
                name: barber.name,
                phone: barber.phone.phoneNumber,
                role: 'barber',
                isActive: true,
                barberShopId: barber.barberShop.id,
            },
            update: {
                cpf: barber.cpf.cleaned,
                hash: barber.password.getHash(),
                name: barber.name,
                phone: barber.phone.phoneNumber,
                role: 'barber',
                isActive: true,
                barberShopId: barber.barberShop.id,
            }
        })
    }

    async isCPFInUse(cpf: CPF): Promise<boolean> {
        const counter = await prisma.user.count({
            where: {
                cpf: cpf.cleaned,
                isActive: true
            }
        })

        return counter == 1
    }

    async isNameInUse(name: string): Promise<boolean> {
        const counter = await prisma.user.count({
            where: {
                name: name,
                isActive: true
            }
        })

        return counter == 1
    }

    async isPhoneInUse(phone: Phone): Promise<boolean> {
        const counter = await prisma.user.count({
            where: {
                phone: phone.phoneNumber,
                isActive: true
            }
        })

        return counter == 1
    }

    private async findBarberBy({ id, phone, cpf, name }: { id?: string, phone?: string, name?: string, cpf?: string }): Promise<Barber | undefined> {
        const barber = await prisma.user.findUnique({
            where: {
                id,
                phone,
                name,
                cpf,
                isActive: true,
                role: 'barber'
            },
            include: {
                operation: true,
                dayOffs: true,
                barberShop: {
                    include: {
                        address: true,
                        operation: true,
                        holidays: true,
                    }
                },
            }
        })

        if (!barber || !barber.barberShop) return undefined

        return convertBarberFromDBToEntity(barber)
    }

    async findById(id: string): Promise<Barber | undefined> {
        return await this.findBarberBy({
            id
        })
    }

    async findByName(name: string): Promise<Barber | undefined> {
        return await this.findBarberBy({
            name
        })
    }

    async findByPhone(phone: Phone): Promise<Barber | undefined> {
        return await this.findBarberBy({
            phone: phone.phoneNumber
        })
    }

    async findByCPF(cpf: CPF): Promise<Barber | undefined> {
        return await this.findBarberBy({
            cpf: cpf.cleaned
        })
    }

    async getBarbersByBarberShop(barberShopId: string, active: boolean = true): Promise<Barber[]> {

        const barbers = await prisma.user.findMany({
            where: {
                role: 'barber',
                barberShopId,
                isActive: active ? true : undefined
            },
            include: {
                operation: true,
                dayOffs: true,
                barberShop: {
                    include: {
                        address: true,
                        operation: true,
                        holidays: true,
                    }
                },
            }
        })

        return barbers.map((barber) => convertBarberFromDBToEntity(barber))
    }

    async countBarbersFromBarberShop(barberShopId: string): Promise<number> {
        return await prisma.user.count({
            where: {
                role: 'barber',
                barberShopId,
                isActive: true
            }
        })
    }

    async addDayOff(barberId: string, date: Date): Promise<void> {
        await prisma.dayOff.create({
            data: {
                userId: barberId,
                date
            }
        })
    }
    async isRegisteredDayOff(barberId: string, date: Date): Promise<boolean> {

        const startDate = new Date(date)
        startDate.setHours(0)
        startDate.setMinutes(0)

        const endDate = new Date(date)
        endDate.setDate(date.getDate() + 1)

        const couter = await prisma.dayOff.count({
            where: {
                userId: barberId,
                date: {
                    gte: startDate,
                    lt: endDate
                }
            }
        })

        return couter > 0
    }
    async removeDayOff(barberId: string, date: Date): Promise<void> {

        const startDate = new Date(date)
        startDate.setHours(0)
        startDate.setMinutes(0)

        const endDate = new Date(date)
        endDate.setDate(date.getDate() + 1)

        await prisma.dayOff.deleteMany({
            where: {
                userId: barberId,
                date: {
                    gte: startDate,
                    lt: endDate
                }
            }
        })
    }

    private async createOrUpdateOperation(operation: Operation, barberId: string, prismaClient: PrismaClient): Promise<void> {
        const existentOperation = await prismaClient.operation.findFirst({
            where: {
                userId: barberId,
                weekDay: operation.day.day
            }
        })

        if (existentOperation) {
            await prismaClient.operation.update({
                where: {
                    id: existentOperation.id
                },
                data: {
                    openHour: operation.openTime.props.hour,
                    openMinute: operation.openTime.props.minute,
                    closeHour: operation.closeTime.props.hour,
                    closeMinute: operation.closeTime.props.minute,
                }
            })
        } else {
            await prismaClient.operation.create({
                data: {
                    weekDay: operation.day.day,
                    openHour: operation.openTime.props.hour,
                    openMinute: operation.openTime.props.minute,
                    closeHour: operation.closeTime.props.hour,
                    closeMinute: operation.closeTime.props.minute,
                    userId: barberId
                }
            })
        }
    }

    async update(barber: Barber): Promise<void> {
        await prisma.user.update({
            where: { id: barber.id },
            data: {
                cpf: barber.cpf.cleaned,
                hash: barber.password.getHash(),
                name: barber.name,
                phone: barber.phone.phoneNumber,
                role: 'barber',
                barberShopId: barber.barberShop.id,

            }
        })

        barber.getOperation().forEach(async (operation) => await this.createOrUpdateOperation(operation, barber.id, prisma))

    }

    async list(options?: { skip: number; limit: number; }): Promise<Barber[]> {
        const barbers = await prisma.user.findMany({
            where: {
                role: 'barber',
                isActive: true
            },
            include: {
                operation: true,
                dayOffs: true,
                barberShop: {
                    include: {
                        address: true,
                        operation: true,
                        holidays: true,
                    }
                },
            },
            skip: options ? options.skip : undefined,
            take: options ? options.limit : undefined
        })


        return barbers.map((barber) => convertBarberFromDBToEntity(barber))
    }

    async delete(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: {
                isActive: false
            }
        })
    }

}