//prisma
import { convertBarberShopFromDBToEntity, prisma } from "./prismaClient";

//contracts
import { IBarberShopRepository } from "../../../application/interfaces/repository/barberShopRepository.interface";

//entities
import { BarberShop } from "../../../domain/Entities/BarberShop";
import { Holiday } from "../../../domain/Entities/Holiday";
import { Operation } from "../../../domain/Entities/Operation";

//value objects
import { Phone } from "../../../domain/valueObjects/Phone/Phone";
import { PrismaClient } from "@prisma/client";
import { Address } from "../../../domain/valueObjects/Address/Address";




export class PrismaBarberShopRepository implements IBarberShopRepository {

    async create(barberShop: BarberShop): Promise<void> {
        await prisma.barberShop.create({
            data: {
                id: barberShop.id,
                contractExpiration: barberShop.getContractExpirationDate(),
                name: barberShop.name,
                phone: barberShop.phone.phoneNumber,
                address: {
                    create: {
                        city: barberShop.address.props.city,
                        country: barberShop.address.props.country,
                        neighborhood: barberShop.address.props.neighborhood,
                        number: barberShop.address.props.number,
                        state: barberShop.address.props.state,
                        street: barberShop.address.props.street,
                        zipCode: barberShop.address.props.zipCode,
                        complement: barberShop.address.props.complement,
                    }
                },
                barberLimit: barberShop.getBarberLimit(),
                manager: {
                    connect: {
                        id: barberShop.managerId
                    }
                },
            }
        })
    }

    private async createOrUpdateHoliday(holiday: Holiday, barberShopId: string, prismaClient: PrismaClient): Promise<void> {
        const existentHoliday = await prismaClient.holiday.findFirst({
            where: {
                date: holiday.props.date,
                barberShopId: barberShopId
            }
        })

        const data = {
            closeHour: holiday.props.closeTime.props.hour,
            closeMinute: holiday.props.closeTime.props.minute,
            date: holiday.props.date,
            isClosed: holiday.props.isClosed,
            openHour: holiday.props.openTime.props.hour,
            openMinute: holiday.props.openTime.props.minute,
            barberShopId: barberShopId,
        }

        if (existentHoliday) {
            await prismaClient.holiday.update({
                where: {
                    id: existentHoliday.id
                },
                data
            })
        } else {
            await prismaClient.holiday.create({
                data
            })
        }
    }

    private async createOrUpdateOperation(operation: Operation, barberShopId: string, prismaClient: PrismaClient): Promise<void> {
        const existentOperation = await prismaClient.operation.findFirst({
            where: {
                barberShopId,
                weekDay: operation.day.day
            }
        })

        const data = {
            openHour: operation.openTime.props.hour,
            openMinute: operation.openTime.props.minute,
            closeHour: operation.closeTime.props.hour,
            closeMinute: operation.closeTime.props.minute,
        }

        if (existentOperation) {
            await prismaClient.operation.update({
                where: {
                    id: existentOperation.id
                },
                data
            })
        } else {
            await prismaClient.operation.create({
                data: {
                    ...data,
                    weekDay: operation.day.day,
                    barberShopId
                }
            })
        }
    }

    async update(barberShop: BarberShop): Promise<void> {
        await prisma.barberShop.update({
            where: {
                id: barberShop.id
            },
            data: {
                contractExpiration: barberShop.getContractExpirationDate(),
                name: barberShop.name,
                phone: barberShop.phone.phoneNumber,
                address: {
                    update: {
                        city: barberShop.address.props.city,
                        country: barberShop.address.props.country,
                        neighborhood: barberShop.address.props.neighborhood,
                        number: barberShop.address.props.number,
                        state: barberShop.address.props.state,
                        street: barberShop.address.props.street,
                        zipCode: barberShop.address.props.zipCode,
                        complement: barberShop.address.props.complement,
                    }
                },
                barberLimit: barberShop.getBarberLimit(),
                manager: {
                    connect: {
                        id: barberShop.managerId
                    }
                }
            }
        })

        const holidayPromises = barberShop.holidays.map((holiday) => this.createOrUpdateHoliday(holiday, barberShop.id, prisma))
        await Promise.all(holidayPromises)

        const operationPromises = barberShop.getOperation().map((operation) => this.createOrUpdateOperation(operation, barberShop.id, prisma))
        await Promise.all(operationPromises)
    }

    private async findBarberShopBy({ id, name, phone }: { id?: string, name?: string, phone?: string }): Promise<BarberShop | undefined> {
        if (!id && !name && !phone) return undefined
        const barberShop = await prisma.barberShop.findUnique({
            where: { id, name, phone },
            include: { address: true, holidays: true, operation: true }
        })

        if (!barberShop) return undefined

        return convertBarberShopFromDBToEntity(barberShop)
    }

    async findById(barberShopId: string): Promise<BarberShop | undefined> {
        return await this.findBarberShopBy({
            id: barberShopId
        })
    }

    async findByPhone(phone: Phone): Promise<BarberShop | undefined> {
        return await this.findBarberShopBy({
            phone: phone.phoneNumber
        })
    }

    async findByName(name: string): Promise<BarberShop | undefined> {
        return await this.findBarberShopBy({
            name
        })
    }

    async list(options: { skip?: number, limit?: number, country?: string, state?: string, city?: string, neighborhood?: string }): Promise<BarberShop[]> {

        let barberShops

        if (typeof options.skip != 'number' || typeof options.limit != 'number') {
            barberShops = await prisma.barberShop.findMany({
                where: {
                    address: {
                        country: {
                            contains: options.country
                        },
                        state: {
                            contains: options.state
                        },
                        city: {
                            contains: options.city
                        },
                        neighborhood: {
                            contains: options.neighborhood
                        },
                    }
                },
                include: {
                    address: true,
                    operation: true,
                    holidays: true
                }
            })
        } else {
            barberShops = await prisma.barberShop.findMany({
                take: options.limit,
                skip: options.skip,
                where: {
                    address: {
                        country: {
                            contains: options.country
                        },
                        state: {
                            contains: options.state
                        },
                        city: {
                            contains: options.city
                        },
                        neighborhood: {
                            contains: options.neighborhood
                        },
                    }
                },
                include: {
                    address: true,
                    operation: true,
                    holidays: true
                }
            })
        }


        return barberShops.map((barberShop) => convertBarberShopFromDBToEntity(barberShop))
    }

    async delete(id: string): Promise<void> {
        await prisma.barberShop.delete({ where: { id } })
    }

    async deleteHoliday(barberShopId: string, date: Date): Promise<void> {

        const existentHoliday = await prisma.holiday.findFirst({
            where: {
                barberShopId,
                date
            }
        })

        if (!existentHoliday) throw new Error('Feriado não encontrado')

        await prisma.holiday.deleteMany({
            where: {
                barberShopId,
                date: date
            }
        })
    }

    async isAddressInUse(address: Address): Promise<boolean> {
        const isAddressInUse = await prisma.address.count({
            where: {
                city: address.props.city,
                country: address.props.country,
                neighborhood: address.props.neighborhood,
                number: address.props.number,
                state: address.props.state,
                street: address.props.street,
                zipCode: address.props.zipCode,
                complement: address.props.complement,
            }
        })

        return isAddressInUse >= 1
    }

}