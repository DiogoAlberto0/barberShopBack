import { Holiday } from "../../../../domain/Entities/Holiday"
import { Time } from "../../../../domain/valueObjects/Time/Time"
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface"
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface"
import { IUseCase } from "../../IUseCase.interface"


type IAddHolidayInputDTO = {
    managerId: string,
    barberShopId: string,
    date: Date,
    isClosed: boolean,
    openTime?: {
        hour: number,
        minute: number
    },
    closeTime?: {
        hour: number,
        minute: number
    }
}

type IAddHolidayOutputDTO = void

export class AddHolidayUseCase implements IUseCase<IAddHolidayInputDTO, IAddHolidayOutputDTO> {

    constructor(
        private barberShopRepository: IBarberShopRepository,
        private managerRepository: IManagerRepository
    ) { }
    async execute({ managerId, barberShopId, date, isClosed, openTime, closeTime }: IAddHolidayInputDTO): Promise<void> {

        const manager = await this.managerRepository.findById(managerId)
        if (!manager) throw new Error('Usuário não autorizado')

        const existentBarberShop = await this.barberShopRepository.findById(barberShopId)
        if (!existentBarberShop) throw new Error('Estabelecimento não encontrado')

        if (existentBarberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        let openTimeObj: Time
        let closeTimeObj: Time

        if (isClosed) {
            openTimeObj = new Time({
                hour: 0,
                minute: 0
            })
            closeTimeObj = new Time({
                hour: 0,
                minute: 0
            })

        } else {
            if (!openTime || !closeTime) throw new Error('Informe o horário de abertura e fechamento')
            openTimeObj = new Time({
                hour: openTime.hour,
                minute: openTime.minute
            })
            closeTimeObj = new Time({
                hour: closeTime.hour,
                minute: closeTime.minute
            })
        }

        const holiday = new Holiday({
            date: new Date(date),
            openTime: openTimeObj,
            closeTime: closeTimeObj,
            isClosed: isClosed
        })

        existentBarberShop.addHoliday(holiday)
        await this.barberShopRepository.update(existentBarberShop)
    }

}