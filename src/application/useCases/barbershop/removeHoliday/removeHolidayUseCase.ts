
import { Holiday } from "../../../../domain/Entities/Holiday";
import { Time } from "../../../../domain/valueObjects/Time/Time";
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";


interface IRemoveHolidayControllerInputDTO {
    managerId: string,
    barberShopId: string,
    date: Date
}

type IRemoveHolidayControllerOutputDTO = void
export class RemoveHolidayUseCase implements IUseCase<IRemoveHolidayControllerInputDTO, IRemoveHolidayControllerOutputDTO> {

    constructor(
        private managerRepository: IManagerRepository,
        private barberShopRepository: IBarberShopRepository
    ) { }

    async execute({ barberShopId, date, managerId }: IRemoveHolidayControllerInputDTO): Promise<void> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const existentBarberShop = await this.barberShopRepository.findById(barberShopId)
        if (!existentBarberShop) throw new Error('Estabelecimento não encontrado')

        if (existentBarberShop.managerId != manager.id) throw new Error('Usuário não autorizado')


        const openTime = new Time({
            hour: 0,
            minute: 0
        })
        const closeTime = new Time({
            hour: 0,
            minute: 0
        })

        const holiday = new Holiday({
            date,
            closeTime,
            openTime,
            isClosed: true,
        })

        await this.barberShopRepository.deleteHoliday(barberShopId, holiday.props.date)
    }
}