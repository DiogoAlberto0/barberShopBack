import { Router } from "express";
import {
    addHolidayController,
    createBarberShopController,
    getAllBarberShopController,
    incrementContractExpirationController,
    removeHolidayController,
    setBarberShopOperationController,
    updateBarberLimitController,
    updateBarberShopController
} from "../factories/barberShopFactory";
import { validateManagerController } from "../factories/managerFactory";
import { validateAdminController } from "../factories/adminFactory";
import { createPreferenceController, paymentNotificationController, validateMercadoPagoContoller } from "../factories/preferenceFactory";

const router = Router()

router.post('/create', validateAdminController.handle, createBarberShopController.handle)

router.post('/:barberShopId/addHoliday', validateManagerController.handle, addHolidayController.handle)

router.delete('/:barberShopId/removeHoliday', validateManagerController.handle, removeHolidayController.handle)

router.get('/getAll', getAllBarberShopController.handle)

router.put('/:barberShopId/incrementContractExpiration', validateAdminController.handle, incrementContractExpirationController.handle)

router.put('/:barberShopId/setOperation', validateManagerController.handle, setBarberShopOperationController.handle)

router.put('/:barberShopId/barberLimit', validateAdminController.handle, updateBarberLimitController.handle)

router.put('/update/:barberShopId', validateManagerController.handle, updateBarberShopController.handle)

router.post('/:barberShopId/incrementContractExpiration/checkout', validateManagerController.handle, createPreferenceController.handle)

router.post('/validatePayment', validateMercadoPagoContoller.handle, paymentNotificationController.handle)

export { router as barberShopRoutes }