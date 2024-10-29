import { CreatePreferenceController } from "../../application/useCases/preference/createPreference/createPreferenceController";
import { CreatePreferenceUseCase } from "../../application/useCases/preference/createPreference/createPreferenceUseCase";
import { PaymentNotificationController } from "../../application/useCases/preference/notification/paymentNotificationController";
import { ValidatePaymentUseCase } from "../../application/useCases/preference/notification/validatePaymentUseCase";
import { MercadoPagoPaymentRepository } from "../../infra/payment/mercadoPagoPaymentRepository";
import { PrismaAdminRepository } from "../../infra/repository/prismaRepository/adminRepository";
import { PrismaBarberShopRepository } from "../../infra/repository/prismaRepository/barberShopRepository";
import { PrismaManagerRepository } from "../../infra/repository/prismaRepository/managerRepository";
import { PrismaPreferenceRepository } from '../../infra/repository/prismaRepository/preferenceRepository';
import { IncrementContractExiprationUseCase } from '../../application/useCases/barbershop/incrementContractExpiration/incrementContractExpirationUseCase';
import { ValidateMercadoPagoController } from "../../application/useCases/preference/validateMercadoPago/validateMercadoPagoController";

const mercadoPagoPaymentRepository = new MercadoPagoPaymentRepository()
const prismaPreferenceRepository = new PrismaPreferenceRepository()
const barberShopRepository = new PrismaBarberShopRepository()
const managerRepository = new PrismaManagerRepository()


const createPreferenceUseCase = new CreatePreferenceUseCase(mercadoPagoPaymentRepository, prismaPreferenceRepository, barberShopRepository, managerRepository)
export const createPreferenceController = new CreatePreferenceController(createPreferenceUseCase)

const incrementContractExiprationUseCase = new IncrementContractExiprationUseCase(barberShopRepository)
const validatePaymentUseCase = new ValidatePaymentUseCase(mercadoPagoPaymentRepository, prismaPreferenceRepository)
export const paymentNotificationController = new PaymentNotificationController(validatePaymentUseCase, incrementContractExiprationUseCase)

export const validateMercadoPagoContoller = new ValidateMercadoPagoController()