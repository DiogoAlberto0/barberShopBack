import { Router } from "express";
import {
    createBarberController,
    getBarbersByBarberShopController,
    updateBarberController,
    addDayOffController,
    removeDayOffController,
    deleteBarberController,
    setBarberOperationController,
    barberSigninController,
    validateBarberController,
    updatePhoneAndPasswordController
} from "../factories/barberFactory";
import { validateManagerController } from "../factories/managerFactory";


const router = Router()

router.post('/create', validateManagerController.handle, createBarberController.handle)

router.get('/all', getBarbersByBarberShopController.handle)

router.put('/:barberId/update', validateManagerController.handle, updateBarberController.handle)

router.post('/addDayOff', validateManagerController.handle, addDayOffController.handle)

router.delete('/removeDayOff', validateManagerController.handle, removeDayOffController.handle)

router.delete('/delete/:barberId', validateManagerController.handle, deleteBarberController.handle)

router.put('/:barberId/operation', validateManagerController.handle, setBarberOperationController.handle)

router.post('/signin', barberSigninController.handle)

router.put('/updatePhoneAndPass', validateBarberController.handle, updatePhoneAndPasswordController.handle)

export { router as barberRoutes }