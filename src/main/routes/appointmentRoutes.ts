import { Router } from "express";

import {
    createAppointmentController,
    deleteAppointmentController,
    getAppointmentsByBarberController,
    getAppointmentsByBarberShopController,
    getAppointmentsByCustomerController,
    setClosedStatusController
} from "../factories/appointmentsFactory";

//validators
import { validateManagerController } from "../factories/managerFactory";
import { validateBarberController } from "../factories/barberFactory";
import { validateManagerOrBarberController } from "../factories/validateManagerOrBarberFactory";


const router = Router()

router.post('/create', createAppointmentController.handle)
router.delete('/:appointmentId/delete', deleteAppointmentController.handle)
router.get('/byBarberShop', validateManagerController.handle, getAppointmentsByBarberShopController.handle)
router.get('/byBarber', validateBarberController.handle, getAppointmentsByBarberController.handle)
router.get('/byCustomer', getAppointmentsByCustomerController.handle)
router.put('/:appointmentId/setClosed', validateManagerOrBarberController.handle, setClosedStatusController.handle)


export { router as appointmentRoutes }

