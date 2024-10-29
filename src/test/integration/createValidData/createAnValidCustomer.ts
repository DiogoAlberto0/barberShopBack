import { validCustomer } from "../../validEntitiesFromTests/validCustomer"
import { testPrismaClient } from "../prisma"

export const createAnValidCustomer = async () => {
    await testPrismaClient.customer.create({
        data: {
            cpf: validCustomer.cpf.cleaned,
            name: validCustomer.name,
            phone: validCustomer.phone.phoneNumber,
            id: validCustomer.id,
        }
    })
}