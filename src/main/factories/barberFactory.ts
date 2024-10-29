//repositories
import { BearerToken } from "../../infra/authentication/bearerToken";
import { PrismaManagerRepository } from "../../infra/repository/prismaRepository/managerRepository";
import { PrismaBarberRepository } from "../../infra/repository/prismaRepository/barberRepository";
import { PrismaBarberShopRepository } from "../../infra/repository/prismaRepository/barberShopRepository";
import { PrismaAppointmentsRepository } from "../../infra/repository/prismaRepository/appointmentsRepository";


const bearerToken = new BearerToken()
const managerRepository = new PrismaManagerRepository()
const barberRepository = new PrismaBarberRepository()
const barberShopRepository = new PrismaBarberShopRepository()
const appointmentRepository = new PrismaAppointmentsRepository()


import { ValidateBarberUseCase } from '../../application/useCases/barber/validateBarber/validateBarberUseCase'
import { ValidateBarberController } from "../../application/useCases/barber/validateBarber/ValidateBarberController";
const validateBarberUseCase = new ValidateBarberUseCase(bearerToken, barberRepository)
export const validateBarberController = new ValidateBarberController(validateBarberUseCase)

import { CreateBarberController } from "../../application/useCases/barber/createBarber/createBarberController";
import { CreateBarberUseCase } from "../../application/useCases/barber/createBarber/createBarberUseCase";
const createBarberUseCase = new CreateBarberUseCase(barberRepository, barberShopRepository, managerRepository)
export const createBarberController = new CreateBarberController(createBarberUseCase)


import { GetBarbersByBarberShopController } from "../../application/useCases/barber/getBarbersByBarberShop/getBarbersByBarberShopController";
import { GetBarbersByBarberShopUseCase } from "../../application/useCases/barber/getBarbersByBarberShop/getBarbersByBarberShopUseCase";
const getBarbersByBarberShopUseCase = new GetBarbersByBarberShopUseCase(barberRepository, managerRepository, barberShopRepository, bearerToken)
export const getBarbersByBarberShopController = new GetBarbersByBarberShopController(getBarbersByBarberShopUseCase)

import { UpdateBarberUseCase } from "../../application/useCases/barber/updateBarber/updateBarberUseCase";
import { UpdateBarberController } from "../../application/useCases/barber/updateBarber/updateBarberController";
const updateBarberUseCase = new UpdateBarberUseCase(barberRepository, barberShopRepository, managerRepository)
export const updateBarberController = new UpdateBarberController(updateBarberUseCase)

import { AddDayOffUseCase } from "../../application/useCases/barber/dayOff/addDayOff/addDayOffUseCase";
import { AddDayOffController } from "../../application/useCases/barber/dayOff/addDayOff/AddDayOffController";
const addDayOffUseCase = new AddDayOffUseCase(barberRepository, managerRepository, appointmentRepository)
export const addDayOffController = new AddDayOffController(addDayOffUseCase)

import { RemoveDayOffUseCase } from "../../application/useCases/barber/dayOff/removeDayOff/removeDayOffUseCase";
import { RemoveDayOffController } from "../../application/useCases/barber/dayOff/removeDayOff/removeDayOffController";
const removeDayOffUseCase = new RemoveDayOffUseCase(barberRepository, managerRepository)
export const removeDayOffController = new RemoveDayOffController(removeDayOffUseCase)

import { DeleteBarberUseCase } from "../../application/useCases/barber/deleteBarber/deleteBarberUseCase";
import { DeleteBarberController } from "../../application/useCases/barber/deleteBarber/deleteBarberController";
const deleteBarberUseCase = new DeleteBarberUseCase(barberRepository, managerRepository, appointmentRepository)
export const deleteBarberController = new DeleteBarberController(deleteBarberUseCase)

import { SetBarberOperationUseCase } from "../../application/useCases/barber/setBarberOperation/setBarberOperationUseCase";
import { SetBarberOperationController } from "../../application/useCases/barber/setBarberOperation/setBarberOperationController";
const setBarberOperationUseCase = new SetBarberOperationUseCase(barberRepository, managerRepository)
export const setBarberOperationController = new SetBarberOperationController(setBarberOperationUseCase)


import { BarberSigninUseCase } from "../../application/useCases/barber/signinBarber/signinBarberUseCase";
import { BarberSigninController } from "../../application/useCases/barber/signinBarber/signinBarberController";
const barberSigninUseCase = new BarberSigninUseCase(barberRepository, bearerToken, barberShopRepository)
export const barberSigninController = new BarberSigninController(barberSigninUseCase)

import { UpdatePhoneAndPasswordUseCase } from "../../application/useCases/barber/updatePhoneAndPassword/updatePhoneAndPasswordUseCase";
import { UpdatePhoneAndPasswordController } from "../../application/useCases/barber/updatePhoneAndPassword/updatePhoneAndPasswordController";
const updatePhoneAndPasswordUseCase = new UpdatePhoneAndPasswordUseCase(barberRepository)
export const updatePhoneAndPasswordController = new UpdatePhoneAndPasswordController(updatePhoneAndPasswordUseCase)