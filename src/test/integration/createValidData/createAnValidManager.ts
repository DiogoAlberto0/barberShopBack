import { validManager, validManager2 } from "../../validEntitiesFromTests/validManager"
import { testPrismaClient } from "../prisma"

export const createAnValidManager = async () => {
    await testPrismaClient.user.create({
        data: {
            id: validManager.id,
            name: validManager.name,
            cpf: validManager.cpf.cleaned,
            phone: validManager.phone.phoneNumber,
            hash: validManager.password.getHash(),
            role: 'manager',
        }
    })
}

export const createAnValidManager2 = async () => {
    await testPrismaClient.user.create({
        data: {
            id: validManager2.id,
            name: validManager2.name,
            cpf: validManager2.cpf.cleaned,
            phone: validManager2.phone.phoneNumber,
            hash: validManager2.password.getHash(),
            role: 'manager',
        }
    })
}