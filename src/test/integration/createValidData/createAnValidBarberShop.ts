import { validAddress } from "../../validEntitiesFromTests/validAddress"
import { validBarberShop, validBarberShop2 } from "../../validEntitiesFromTests/validBarberShop"
import { validManager, validManager2 } from "../../validEntitiesFromTests/validManager"
import { testPrismaClient } from "../prisma"

const creataAnValidBarberShopOperation = async (barberShopId: string) => {

    const operationArray = validBarberShop.getOperation().map(({ day, openTime, closeTime }) => {
        return testPrismaClient.operation.create({
            data: {
                closeHour: closeTime.props.hour,
                closeMinute: closeTime.props.minute,
                openHour: openTime.props.hour,
                openMinute: openTime.props.minute,
                weekDay: day.day,
                barberShopId,
            }
        })
    })
    await Promise.all(operationArray)
}

export const createAnValidBarberShop = async () => {
    await testPrismaClient.barberShop.create({
        data: {
            id: validBarberShop.id,
            name: validBarberShop.name,
            phone: validBarberShop.phone.phoneNumber,
            contractExpiration: validBarberShop.getContractExpirationDate(),
            barberLimit: validBarberShop.getBarberLimit(),
            manager: {
                connect: {
                    id: validManager.id
                }
            },
            address: {
                create: validAddress.props
            }
        }
    })

    await creataAnValidBarberShopOperation(validBarberShop.id)
}

export const createAnValidBarberShop2 = async () => {
    await testPrismaClient.barberShop.create({
        data: {
            id: validBarberShop2.id,
            name: validBarberShop2.name,
            phone: validBarberShop2.phone.phoneNumber,
            contractExpiration: validBarberShop2.getContractExpirationDate(),
            barberLimit: validBarberShop2.getBarberLimit(),
            manager: {
                connect: {
                    id: validManager2.id
                }
            },
            address: {
                create: {
                    city: validBarberShop2.address.props.city,
                    country: validBarberShop2.address.props.country,
                    neighborhood: validBarberShop2.address.props.neighborhood,
                    number: validBarberShop2.address.props.number,
                    state: validBarberShop2.address.props.state,
                    street: validBarberShop2.address.props.street,
                    zipCode: validBarberShop2.address.props.zipCode,
                    complement: validBarberShop2.address.props.country,
                }
            }
        }
    })
}