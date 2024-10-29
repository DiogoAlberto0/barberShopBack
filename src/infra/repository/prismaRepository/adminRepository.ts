import { Prisma, PrismaClient } from "@prisma/client";
import { IAdminRepository } from "../../../application/interfaces/repository/adminRepository.interface";
import { Admin } from "../../../domain/Entities/Admin";
import { CPF } from "../../../domain/valueObjects/CPF/CPF";
import { Phone } from "../../../domain/valueObjects/Phone/Phone";
import { convertAdminFromDBToEntity } from "./prismaClient";
import { DefaultArgs } from "@prisma/client/runtime/library";



export class PrismaAdminRepository implements IAdminRepository {

    private prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
    constructor(prismaClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) {
        this.prisma = prismaClient
    }
    async create(admin: Admin): Promise<void> {
        await this.prisma.user.create({
            data: {
                id: admin.id,
                name: admin.name,
                cpf: admin.cpf.cleaned,
                phone: admin.phone.phoneNumber,
                hash: admin.password.getHash(),
                role: 'admin',
            }
        })
    }

    async isCPFInUse(cpf: CPF): Promise<boolean> {
        const counter = await this.prisma.user.count({
            where: {
                cpf: cpf.cleaned
            }
        })

        return counter == 1
    }

    async isNameInUse(name: string): Promise<boolean> {
        const counter = await this.prisma.user.count({
            where: {
                name: name
            }
        })

        return counter == 1
    }

    async isPhoneInUse(phone: Phone): Promise<boolean> {
        const counter = await this.prisma.user.count({
            where: {
                phone: phone.phoneNumber
            }
        })

        return counter == 1
    }


    private async findAdminBy({ id, name, cpf, phone }: { id?: string, name?: string, cpf?: string, phone?: string }): Promise<Admin | undefined> {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
                name,
                phone,
                cpf,
                role: 'admin'
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

        return convertAdminFromDBToEntity(user)

    }

    async findById(id: string): Promise<Admin | undefined> {
        return await this.findAdminBy({
            id
        })
    }

    async findByPhone(phone: Phone): Promise<Admin | undefined> {
        return await this.findAdminBy({
            phone: phone.phoneNumber
        })
    }

}