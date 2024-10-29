import { IPreferenceRepository } from "../../../application/interfaces/repository/preferenceRepository.interface";
import { Preference } from "../../../domain/Entities/Preference";
import { convertPreferenceFromDBToEntity, prisma } from "./prismaClient";


export class PrismaPreferenceRepository implements IPreferenceRepository {
    async findLastBy(options: { barberShopId: string; createdAt: Date; title: string; quantity: number; price: number; }): Promise<Preference | undefined> {

        const { barberShopId, createdAt, price, quantity, title } = options

        const startDate = new Date(createdAt)
        startDate.setHours(0)
        startDate.setMinutes(0)

        const endDate = new Date(createdAt)
        endDate.setDate(startDate.getDate() + 1)
        endDate.setHours(0)
        endDate.setMinutes(0)

        const preference = await prisma.preference.findFirst({
            where: {
                barberShopId,
                price,
                quantity,
                title,
                date: {
                    gte: startDate,
                    lt: endDate
                }
            }
        })

        return preference ? convertPreferenceFromDBToEntity(preference) : undefined
    }
    update(preference: Preference): Promise<void> {
        throw new Error("Method not implemented.");
    }
    save = async (preference: Preference): Promise<void> => {
        await prisma.preference.create({
            data: {
                id: preference.id,
                title: preference.title,
                date: preference.date,
                quantity: preference.quantity,
                status: preference.status,
                totalPrice: preference.totalPrice,
                price: preference.price,
                barberShopId: preference.barberShopId,
            }
        })
    }
    findById = async (preferenceId: string): Promise<Preference | undefined> => {
        const preference = await prisma.preference.findUnique({
            where: {
                id: preferenceId
            }
        })

        if (!preference) return undefined

        return convertPreferenceFromDBToEntity(preference)
    }

}