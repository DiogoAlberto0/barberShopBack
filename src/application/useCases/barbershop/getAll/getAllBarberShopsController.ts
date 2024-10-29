import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetAllBarberShopUseCase } from "./getAllBarberShopsUseCase";





export class GetAllBarberShopsController implements IController {

    constructor(
        private getAllBarberShopsUseCase: GetAllBarberShopUseCase
    ) { }
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const page = Number(req.query.page)
            const pageSize = Number(req.query.pageSize)

            const country = req.query.country as string
            const state = req.query.state as string
            const city = req.query.city as string
            const neighborhood = req.query.neighborhood as string


            const barberShops = await this.getAllBarberShopsUseCase.execute({
                page: isNaN(page) ? undefined : page,
                pageSize: isNaN(pageSize) ? undefined : pageSize,
                country,
                state,
                city,
                neighborhood
            })

            res.send({
                ...barberShops,
                page,
                pageSize
            })
        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }
}