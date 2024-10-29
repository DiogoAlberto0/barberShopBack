import { validBarber, validBarber2 } from "../../validEntitiesFromTests/validBarber"
import { validBarberShop } from "../../validEntitiesFromTests/validBarberShop"
import { testPrismaClient } from "../prisma"

const creataAnValidBarberOperation = async (userId: string) => {

    const operationArray = validBarber.getOperation().map(({ day, openTime, closeTime }) => {
        return testPrismaClient.operation.create({
            data: {
                closeHour: closeTime.props.hour,
                closeMinute: closeTime.props.minute,
                openHour: openTime.props.hour,
                openMinute: openTime.props.minute,
                weekDay: day.day,
                userId,
            }
        })
    })

    await Promise.all(operationArray)
}

export const createAnValidBarber = async () => {
    await testPrismaClient.user.create({
        data: {
            id: validBarber.id,
            name: validBarber.name,
            cpf: validBarber.cpf.cleaned,
            phone: validBarber.phone.phoneNumber,
            hash: validBarber.password.getHash(),
            role: 'barber',
            barberShop: {
                connect: {
                    id: validBarberShop.id
                }
            }
        }
    })

    await creataAnValidBarberOperation(validBarber.id)
}

export const createAnValidBarber2 = async () => {
    await testPrismaClient.user.create({
        data: {
            id: validBarber2.id,
            name: validBarber2.name,
            cpf: validBarber2.cpf.cleaned,
            phone: validBarber2.phone.phoneNumber,
            hash: validBarber2.password.getHash(),
            role: 'barber',
            barberShop: {
                connect: {
                    id: validBarberShop.id
                }
            }
        }
    })

    await creataAnValidBarberOperation(validBarber.id)
}