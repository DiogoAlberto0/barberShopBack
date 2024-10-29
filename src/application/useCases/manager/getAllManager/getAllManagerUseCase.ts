import { Manager } from "../../../../domain/Entities/Manager";
import { IManagerRepository } from "../../../interfaces/repository/managerRepository.interface";
import { IUseCase } from "../../IUseCase.interface";

export type GetAllManagerInputDTO = {
    page?: number,
    pageSize?: number
}

export type GetAllManagerOutputDTO = {
    managers: Manager[],
    total: number
}
export class GetAllManagerUseCase implements IUseCase<GetAllManagerInputDTO, GetAllManagerOutputDTO> {

    constructor(
        private managerRepository: IManagerRepository
    ) { }
    execute = async ({ pageSize, page }: GetAllManagerInputDTO): Promise<GetAllManagerOutputDTO> => {
        let managers: Manager[]
        const total = await this.managerRepository.count()

        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            managers = await this.managerRepository.list({ skip, limit: pageSize })
        } else {
            managers = await this.managerRepository.list()
        }
        return {
            managers,
            total
        }
    }

}