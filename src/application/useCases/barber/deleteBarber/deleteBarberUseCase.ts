import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface";
import { IUseCase } from "../../IUseCase.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface";



type IDeleteBarberInputDTO = {
    barberId: string;
    managerId: string;
}

type IDeleteBarberOutputDTO = void

export class DeleteBarberUseCase implements IUseCase<IDeleteBarberInputDTO, IDeleteBarberOutputDTO> {

    constructor(
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository,
        private appointmentsRepository: IAppointmentRepository
    ) { }
    async execute({ barberId, managerId }: IDeleteBarberInputDTO): Promise<IDeleteBarberOutputDTO> {

        if (!barberId) throw new Error("ID inválido")
        const barber = await this.barberRepository.findById(barberId);
        if (!barber) throw new Error('Funcionário não encontrado');

        if (!managerId) throw new Error('Usuário não autorizado')
        const manager = await this.managerRepository.findById(managerId)
        if (!manager || barber.barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')

        await this.barberRepository.delete(barberId)
    }
}