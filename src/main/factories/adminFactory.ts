import { PrismaClient } from "@prisma/client";
import { SigninAdminController } from "../../application/useCases/admin/signinAdmin/signinAdminController";
import { SigninAdminUseCase } from "../../application/useCases/admin/signinAdmin/signinAdminUseCase";
import { ValidateAdminUseCase } from "../../application/useCases/admin/validateAdmin/validateAdmin";
import { ValidateAdminController } from "../../application/useCases/admin/validateAdmin/ValidateAdminController";
import { BearerToken } from "../../infra/authentication/bearerToken";
import { PrismaAdminRepository } from "../../infra/repository/prismaRepository/adminRepository";



const prismaClient = new PrismaClient()
const adminRepository = new PrismaAdminRepository(prismaClient)
const bearerTokenRepository = new BearerToken()


const validateAdminUseCase = new ValidateAdminUseCase(bearerTokenRepository, adminRepository)
export const validateAdminController = new ValidateAdminController(validateAdminUseCase)

const signinAdminUseCase = new SigninAdminUseCase(adminRepository, bearerTokenRepository)
export const signinAdminController = new SigninAdminController(signinAdminUseCase)