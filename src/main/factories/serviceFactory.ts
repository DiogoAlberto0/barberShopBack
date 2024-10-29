import { CreateNewServiceUseCase } from "../../application/useCases/service/createService/createServiceUseCase";
import { DeleteServiceUseCase } from "../../application/useCases/service/deleteService/deleteServiceUseCase";
import { GetServicesByBarberShopUseCase } from "../../application/useCases/service/getServicesByBarberShop/getServicesByBarberShopUseCase";
import { PrismaBarberShopRepository } from "../../infra/repository/prismaRepository/barberShopRepository";
import { PrismaManagerRepository } from "../../infra/repository/prismaRepository/managerRepository";
import { PrismaServiceRepository } from "../../infra/repository/prismaRepository/serviceRepository";
import { CreateServiceController } from "../../application/useCases/service/createService/createServiceController";
import { DeleteServiceController } from "../../application/useCases/service/deleteService/deleteServiceController";
import { GetServicesByBarberShopController } from "../../application/useCases/service/getServicesByBarberShop/getServiceByBarberShopController";
import { UpdateServiceController } from "../../application/useCases/service/updateService/updateServiceController";
import { UpdateServiceUseCase } from "../../application/useCases/service/updateService/updateServiceUseCase";


const serviceRepository = new PrismaServiceRepository()
const barberShopRepository = new PrismaBarberShopRepository()
const managerRepository = new PrismaManagerRepository()

const createServiceUseCase = new CreateNewServiceUseCase(serviceRepository, barberShopRepository, managerRepository)
export const createServiceController = new CreateServiceController(createServiceUseCase)

const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository, managerRepository, barberShopRepository)
export const deleteServiceController = new DeleteServiceController(deleteServiceUseCase)

const getServiceByBarberShopUseCase = new GetServicesByBarberShopUseCase(barberShopRepository, serviceRepository)
export const getServiceByBarberShopController = new GetServicesByBarberShopController(getServiceByBarberShopUseCase)

const updateServiceShopUseCase = new UpdateServiceUseCase(serviceRepository, managerRepository, barberShopRepository)
export const updateServiceShopController = new UpdateServiceController(updateServiceShopUseCase)





