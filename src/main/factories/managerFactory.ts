import { PrismaManagerRepository } from '../../infra/repository/prismaRepository/managerRepository'
import { BearerToken } from '../../infra/authentication/bearerToken'
const managerRepository = new PrismaManagerRepository()
const bearerToken = new BearerToken()


import { ValidateManagerUseCase } from '../../application/useCases/manager/validateManager/validateManagerUseCase'
import { ValidateManagerController } from '../../application/useCases/manager/validateManager/ValidateManagerController'
const validateManagerUseCase = new ValidateManagerUseCase(bearerToken, managerRepository)
export const validateManagerController = new ValidateManagerController(validateManagerUseCase)


import { SigninManagerController } from '../../application/useCases/manager/signinManager/SigninManagerController'
import { SigninManagerUseCase } from '../../application/useCases/manager/signinManager/signinManagerUseCase'
const signinManagerUseCase = new SigninManagerUseCase(managerRepository, bearerToken)
export const signinManagerController = new SigninManagerController(signinManagerUseCase)

import { CreateManagerController } from '../../application/useCases/manager/createManager/createManagerController'
import { CreateManagerUseCase } from '../../application/useCases/manager/createManager/createManagerUseCase'
const createManagerUseCase = new CreateManagerUseCase(managerRepository)
export const createManagerController = new CreateManagerController(createManagerUseCase)

import { GetAllManagerUseCase } from '../../application/useCases/manager/getAllManager/getAllManagerUseCase'
import { GetAllManagerController } from '../../application/useCases/manager/getAllManager/getAllManagerController'
const getAllManagersUseCase = new GetAllManagerUseCase(managerRepository)
export const getAllManagerController = new GetAllManagerController(getAllManagersUseCase)

import { UpdateManagerUseCase } from '../../application/useCases/manager/updateManager/updateManagerUseCase'
import { UpdateManagerController } from '../../application/useCases/manager/updateManager/updateManagerController'
const updateManagerUseCase = new UpdateManagerUseCase(managerRepository)
export const updateManagerController = new UpdateManagerController(updateManagerUseCase)
