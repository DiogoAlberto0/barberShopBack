import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetServicesByBarberShopUseCase } from "./getServicesByBarberShopUseCase";




export class GetServicesByBarberShopController implements IController {

    constructor(
        private getServicesByBarberShopUseCase: GetServicesByBarberShopUseCase
    ) { }


    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const barberShopId = req.query.barberShopId as string
            if (!barberShopId) throw new Error('Informe a barbearia')

            const services = await this.getServicesByBarberShopUseCase.execute({
                barberShopId
            })

            res.send({
                ...services
            })

        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}