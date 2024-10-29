// prisma
import { convertManagerFromDBToEntity, prisma } from "./prismaClient";

//contracts
import { IManagerRepository } from "../../../application/interfaces/repository/managerRepository.interface";

//entities
import { Manager } from "../../../domain/Entities/Manager";

//value objects
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";

export class PrismaManagerRepository implements IManagerRepository {

    async create(manager: Manager): Promise<void> {
        await prisma.user.create({
            data: {
                id: manager.id,
                name: manager.name,
                cpf: manager.cpf.cleaned,
                phone: manager.phone.phoneNumber,
                hash: manager.password.getHash(),
                role: 'manager',
            }
        })
    }

    async isCPFInUse(cpf: CPF): Promise<boolean> {
        const counter = await prisma.user.count({
            where: {
                cpf: cpf.cleaned
            }
        })

        return counter == 1
    }

    async isNameInUse(name: string): Promise<boolean> {
        const counter = await prisma.user.count({
            where: {
                name: name
            }
        })

        return counter == 1
    }

    async isPhoneInUse(phone: Phone): Promise<boolean> {
        const counter = await prisma.user.count({
            where: {
                phone: phone.phoneNumber
            }
        })

        return counter == 1
    }

    async update(manager: Manager): Promise<void> {

        const { id, name, phone, cpf, password } = manager

        await prisma.user.update({
            where: { id },
            data: {
                name,
                cpf: cpf.cleaned,
                hash: password.getHash(),
                phone: phone.phoneNumber,
            }
        })
    }

    private async findManagerBy({ id, name, cpf, phone }: { id?: string, name?: string, cpf?: string, phone?: string }): Promise<Manager | undefined> {

        const user = await prisma.user.findUnique({
            where: {
                id,
                name,
                phone,
                cpf,
                role: 'manager'
            },
            include: {
                management: {
                    include: {
                        address: true,
                        holidays: true,
                        operation: true
                    }
                }
            }
        })

        if (!user) return undefined

        return convertManagerFromDBToEntity({ ...user })

    }

    async findById(id: string): Promise<Manager | undefined> {
        return await this.findManagerBy({
            id
        })
    }
    async findByName(name: string): Promise<Manager | undefined> {
        return await this.findManagerBy({
            name
        })
    }
    async findByPhone(phone: Phone): Promise<Manager | undefined> {
        return await this.findManagerBy({
            phone: phone.phoneNumber
        })
    }
    async findByCPF(cpf: CPF): Promise<Manager | undefined> {
        return await this.findManagerBy({
            cpf: cpf.cleaned
        })
    }
    async list(options?: { skip: number; limit: number; }): Promise<Manager[]> {
        const managers = await prisma.user.findMany({
            where: {
                role: 'manager'
            },
            skip: options ? options.skip : undefined,
            take: options ? options.limit : undefined,
            include: {
                management: {
                    include: {
                        address: true,
                        holidays: true,
                        operation: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })


        return managers.map((user) => convertManagerFromDBToEntity({ ...user, hash: '' }))
    }
    async delete(id: string): Promise<void> {
        await prisma.user.delete({ where: { id } })
    }
    async count(): Promise<number> {
        return await prisma.user.count({
            where: {
                role: 'manager'
            }
        })
    }

}