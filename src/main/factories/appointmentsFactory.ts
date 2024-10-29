//repositories
import { PrismaBarberShopRepository } from "../../infra/repository/prismaRepository/barberShopRepository";
import { PrismaBarberRepository } from "../../infra/repository/prismaRepository/barberRepository";
import { PrismaManagerRepository } from "../../infra/repository/prismaRepository/managerRepository";
import { PrismaAppointmentsRepository } from "../../infra/repository/prismaRepository/appointmentsRepository";
import { PrismaServiceRepository } from "../../infra/repository/prismaRepository/serviceRepository";


import { DeleteAppointmentUseCase } from "../../application/useCases/appointment/deleteAppointment/deleteAppointmentUseCase";
import { DeleteAppointmentController } from "../../application/useCases/appointment/deleteAppointment/deleteAppointmentController";

import { SetClosedStatusUseCase } from "../../application/useCases/appointment/setClosedStatus/setClosedStatusUseCase";
import { SetClosedStatusController } from "../../application/useCases/appointment/setClosedStatus/setClosedStatusController";

import { GetAppointmentsByBarberUseCase } from "../../application/useCases/appointment/getAppointmentsByBarber/getAppointmentsByBarberUseCase";
import { GetAppointmentsByBarberController } from "../../application/useCases/appointment/getAppointmentsByBarber/getAppointmentsByBarberController";

import { GetAppointmentsByBarberShopUseCase } from "../../application/useCases/appointment/getAppointmentsByBarberShop/getAppointmentsByBarberShopUseCase";
import { GetAppointmentsByBarberShopController } from "../../application/useCases/appointment/getAppointmentsByBarberShop/getAppointmentsByBarberShopController";

import { GetAppointmentsByCustomerUseCase } from "../../application/useCases/appointment/getAppointmentsByCustomer/getAppointmentsByCustomerUseCase";
import { GetAppointmentsByCustomerController } from "../../application/useCases/appointment/getAppointmentsByCustomer/getAppointmentsByCustomerController";

import { CreateNewAppointmentUseCase } from "../../application/useCases/appointment/createNewAppointment/createAppointmentUseCase";
import { CreateAppointmentController } from "../../application/useCases/appointment/createNewAppointment/createAppointmentController";

const barberShopRepository = new PrismaBarberShopRepository()
const managerRepository = new PrismaManagerRepository()
const barberRepository = new PrismaBarberRepository()
const appointmentRepository = new PrismaAppointmentsRepository()
const serviceRepository = new PrismaServiceRepository()

const createAppointmentUseCase = new CreateNewAppointmentUseCase(barberShopRepository, barberRepository, serviceRepository, appointmentRepository)
export const createAppointmentController = new CreateAppointmentController(createAppointmentUseCase)

const deleteAppointmentUseCase = new DeleteAppointmentUseCase(appointmentRepository)
export const deleteAppointmentController = new DeleteAppointmentController(deleteAppointmentUseCase)

const getAppointmentsByBarberUseCase = new GetAppointmentsByBarberUseCase(appointmentRepository)
export const getAppointmentsByBarberController = new GetAppointmentsByBarberController(getAppointmentsByBarberUseCase)

const getAppointmentsByBarberShopUseCase = new GetAppointmentsByBarberShopUseCase(appointmentRepository, managerRepository, barberShopRepository)
export const getAppointmentsByBarberShopController = new GetAppointmentsByBarberShopController(getAppointmentsByBarberShopUseCase)

const getAppointmentsByCustomerUseCase = new GetAppointmentsByCustomerUseCase(appointmentRepository)
export const getAppointmentsByCustomerController = new GetAppointmentsByCustomerController(getAppointmentsByCustomerUseCase)

const setClosedStatusUseCase = new SetClosedStatusUseCase(appointmentRepository, barberRepository, managerRepository, barberShopRepository)
export const setClosedStatusController = new SetClosedStatusController(setClosedStatusUseCase)