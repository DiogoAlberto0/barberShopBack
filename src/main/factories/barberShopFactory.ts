import { AddHolidayUseCase } from "../../application/useCases/barbershop/addHoliday/addHolidayUseCase";
import { CreateBarberShopUseCase } from "../../application/useCases/barbershop/createBarberShop/createBarberShopUseCase";
import { GetAllBarberShopUseCase } from "../../application/useCases/barbershop/getAll/getAllBarberShopsUseCase";
import { IncrementContractExiprationUseCase } from "../../application/useCases/barbershop/incrementContractExpiration/incrementContractExpirationUseCase";
import { SetBarberShopOperationUseCase } from "../../application/useCases/barbershop/setBarberShopOperation/setBarberShopOperationUseCase";
import { UpdateBarberLimitUseCase } from "../../application/useCases/barbershop/updateBarberLimit/updateBerberLimitUseCase";
import { UpdateBarberShopUseCase } from "../../application/useCases/barbershop/updateBarberShop/updateBarberShopUseCase";
import { PrismaBarberRepository } from "../../infra/repository/prismaRepository/barberRepository";
import { PrismaBarberShopRepository } from "../../infra/repository/prismaRepository/barberShopRepository";
import { PrismaManagerRepository } from "../../infra/repository/prismaRepository/managerRepository";
import { AddHolidayController } from "../../application/useCases/barbershop/addHoliday/addHolidayController";
import { CreateBarberShopController } from "../../application/useCases/barbershop/createBarberShop/createBarberShopController";
import { GetAllBarberShopsController } from "../../application/useCases/barbershop/getAll/getAllBarberShopsController";
import { IncrementContractExpirationController } from "../../application/useCases/barbershop/incrementContractExpiration/incrementContractExpirationController";
import { SetBarberShopOperationController } from "../../application/useCases/barbershop/setBarberShopOperation/setBarberShopOperationController";
import { UpdateBarberLimitController } from "../../application/useCases/barbershop/updateBarberLimit/updateBarberLimitController";
import { UpdateBarberShopController } from "../../application/useCases/barbershop/updateBarberShop/updateBarberShopController";
import { RemoveHolidayUseCase } from "../../application/useCases/barbershop/removeHoliday/removeHolidayUseCase";
import { RemoveHolidayController } from "../../application/useCases/barbershop/removeHoliday/removeHolidayController";


const barberShopRepository = new PrismaBarberShopRepository()
const managerRepository = new PrismaManagerRepository()
const barberRepository = new PrismaBarberRepository()


const createBarberShopUseCase = new CreateBarberShopUseCase(barberShopRepository, managerRepository)
export const createBarberShopController = new CreateBarberShopController(createBarberShopUseCase)

const addHolidayUseCase = new AddHolidayUseCase(barberShopRepository, managerRepository)
export const addHolidayController = new AddHolidayController(addHolidayUseCase)

const getAllBarberShopUseCase = new GetAllBarberShopUseCase(barberShopRepository)
export const getAllBarberShopController = new GetAllBarberShopsController(getAllBarberShopUseCase)

const incrementContractExpirationUseCase = new IncrementContractExiprationUseCase(barberShopRepository)
export const incrementContractExpirationController = new IncrementContractExpirationController(incrementContractExpirationUseCase)

const setBarberShopOperationUseCase = new SetBarberShopOperationUseCase(barberShopRepository, managerRepository)
export const setBarberShopOperationController = new SetBarberShopOperationController(setBarberShopOperationUseCase)

const updateBarberLimitUseCase = new UpdateBarberLimitUseCase(barberShopRepository, barberRepository)
export const updateBarberLimitController = new UpdateBarberLimitController(updateBarberLimitUseCase)

const updateBarberShopUseCase = new UpdateBarberShopUseCase(barberShopRepository, managerRepository)
export const updateBarberShopController = new UpdateBarberShopController(updateBarberShopUseCase)

const removeHolidayUseCase = new RemoveHolidayUseCase(managerRepository, barberShopRepository)
export const removeHolidayController = new RemoveHolidayController(removeHolidayUseCase)