import { BearerToken } from "../../infra/authentication/bearerToken";
import { PrismaBarberRepository } from "../../infra/repository/prismaRepository/barberRepository";
import { PrismaManagerRepository } from "../../infra/repository/prismaRepository/managerRepository";
import { ValidateManagerOrBarberController } from "../../application/useCases/validateManagerOrBarber/ValidateManagerOrBarberController";
import { ValidateManagerOrBarberUseCase } from "../../application/useCases/validateManagerOrBarber/validateManagerOrBarberUseCase";

const bearerToken = new BearerToken()
const managerRepository = new PrismaManagerRepository()
const barberRepository = new PrismaBarberRepository()

const validateManagerOrBarberUseCase = new ValidateManagerOrBarberUseCase(bearerToken, barberRepository, managerRepository)

export const validateManagerOrBarberController = new ValidateManagerOrBarberController(validateManagerOrBarberUseCase)