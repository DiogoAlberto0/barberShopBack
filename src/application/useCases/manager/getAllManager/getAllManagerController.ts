import { Request, Response, NextFunction } from "express";
import { IController } from "../../../interfaces/IController";
import { GetAllManagerUseCase } from "./getAllManagerUseCase";



export class GetAllManagerController implements IController {

    constructor(
        private getAllManagerUseCase: GetAllManagerUseCase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { page, pageSize } = req.query

            const managers = await this.getAllManagerUseCase.execute({
                page: page ? Number(page) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
            })

            res.send({
                ...managers,
                page: page ? Number(page) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined
            })

        } catch (error: any) {
            res.status(400).send({
                message: error.message || 'Erro desconhecido'
            })
        }
    }

}