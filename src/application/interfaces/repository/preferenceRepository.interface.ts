import { Preference } from "../../../domain/Entities/Preference";


export interface IPreferenceRepository {
    save(preference: Preference): Promise<void>
    findById(preferenceId: string): Promise<Preference | undefined>
    findLastPendingBy(options: { barberShopId: string, createdAt: Date, title: string, quantity: number, price: number }): Promise<Preference | undefined>
    update(preference: Preference): Promise<void>
}