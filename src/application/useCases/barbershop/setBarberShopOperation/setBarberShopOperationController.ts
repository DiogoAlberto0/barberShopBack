import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { SetBarberShopOperationUseCase } from "./setBarberShopOperationUseCase";


interface operation {
    open: {
        hour: number,
        minute: number,
    },
    close: {
        hour: number,
        minute: number,
    }
}
type operations = {
    0: operation | null,
    1: operation | null,
    2: operation | null,

    3: operation | null,
    4: operation | null,
    5: operation | null,
    6: operation | null,
}

export class SetBarberShopOperationController implements IController {

    constructor(
        private setBarberShopOperationUseCase: SetBarberShopOperationUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const managerId = req.headers.id as string
            if (!managerId) throw new Error('Usuário não autorizado')

            const barberShopId = req.params.barberShopId as string
            if (!barberShopId) throw new Error('Informe o id do funcionário')

            const operation = req.body.operation as operations
            if (!operation) throw new Error('Informe a operacao da barbearia')
            const operationArray = Object.entries(operation)

            if (operationArray.length != 7) throw new Error('Informe todos os dias da semana começando do 0 para domingo até o 6 para segunda')
            operationArray.forEach(([key, value]) => {
                if (Number(key) < 0 || Number(key) > 7) throw new Error('Os dias devem ir de 0 para domingo até o 6 para segunda')
                if (value && (!value.open || !value.close)) throw new Error('Todos os dias devem ter um horário para abertura e fechamento ou nulo caso o estabelecimento não funcione')
                if (value && value.open && (typeof value.open.hour != 'number' || typeof value.open.minute != 'number')) throw new Error('A abertura e o fechamento deve ter as horas e os minutos correspondentes')
                if (value && value.close && (typeof value.close.hour != 'number' || typeof value.close.minute != 'number')) throw new Error('A abertura e o fechamento deve ter as horas e os minutos correspondentes')
                if (value && value.open && value.close && value.close.hour < value.open.hour) throw new Error('O horário de abertura deve ser anterior ao horario de fechamento')
            })

            await this.setBarberShopOperationUseCase.execute({
                barberShopId,
                managerId,
                operation
            })

            res.send({
                message: 'Funcionamento do estabelecimento atualizado com sucesso'
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }


}