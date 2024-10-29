import { Appointment } from "../../../../domain/Entities/Appointment";
import { IAppointmentRepository } from "../../../interfaces/repository/appointmentRepository.interface";
import { IBarberRepository } from "../../../interfaces/repository/barberRepository.interface";
import { IBarberShopRepository } from "../../../interfaces/repository/barberShopRepository.interface";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

type ISetClosedStatusInputDTO = {
    appointmentId: string;
    userId: string;
};

type ISetClosedStatusOutputDTO = void;

export class SetClosedStatusUseCase implements IUseCase<ISetClosedStatusInputDTO, ISetClosedStatusOutputDTO> {
    constructor(
        private appointmentRepository: IAppointmentRepository,
        private barberRepository: IBarberRepository,
        private managerRepository: IManagerRepository,
        private barberShopRepository: IBarberShopRepository
    ) { }

    async execute({ appointmentId, userId }: ISetClosedStatusInputDTO): Promise<ISetClosedStatusOutputDTO> {

        const appointment = await this.appointmentRepository.findById(appointmentId);


        if (!appointment) {
            throw new Error("Agendamento não encontrado");
        }

        if (appointment.status === "CLOSED") {
            throw new Error("Agendamento já está fechado");
        }

        if (appointment.status === "CANCELED") {
            throw new Error("Não é possível fechar um agendamento cancelado");
        }


        const manager = await this.managerRepository.findById(userId)
        const barber = await this.barberRepository.findById(userId)

        if (!manager && !barber) throw new Error('Usuário não autorizado')

        const barberShop = await this.barberShopRepository.findById(appointment.barberShopId)
        if (!barberShop) throw new Error('Usuário não autorizado')

        if (manager && barberShop.managerId != manager.id) throw new Error('Usuário não autorizado')
        if (barber && barber.id != appointment.barberId) throw new Error('Usuário não autorizado')


        const updatedAppointment = Appointment.with({
            ...appointment,
            status: "CLOSED"
        });

        await this.appointmentRepository.update(updatedAppointment);
    }
}
