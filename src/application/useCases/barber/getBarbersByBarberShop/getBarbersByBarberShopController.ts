import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetBarbersByBarberShopUseCase } from "./getBarbersByBarberShopUseCase";
import { barberSigninController } from "../../../../main/factories/barberFactory";



export class GetBarbersByBarberShopController implements IController {

    constructor(
        private getBarbersByBarberShop: GetBarbersByBarberShopUseCase
    ) { }


    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.headers.authorization as string

            const managerToken = token ? token.split(' ')[1] : undefined

            const barberShopId = req.query.barberShopId as string
            if (!barberShopId || typeof barberShopId != 'string') throw new Error('Informar a barbearia')

            const barbers = await this.getBarbersByBarberShop.execute({
                barberShopId,
                managerToken,
            })

            if (!token) {
                res.send({
                    barbers: barbers.barbers.map(barber => ({
                        id: barber.id,
                        name: barber.name,
                        phone: barber.phone,
                        barberShop: barber.barberShop,
                        operation: barber.getOperation(),
                        daysOff: barber.getDaysOff()
                    }))
                })
            } else {
                res.send({
                    barbers: barbers.barbers
                })
            }
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }


}