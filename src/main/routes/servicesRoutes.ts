import { Router } from "express";
import { createServiceController, deleteServiceController, getServiceByBarberShopController, updateServiceShopController } from "../factories/serviceFactory";
import { validateManagerController } from "../factories/managerFactory";


const router = Router()

router.post('/create', validateManagerController.handle, createServiceController.handle)
router.delete('/:serviceId/delete', validateManagerController.handle, deleteServiceController.handle)
router.put('/:serviceId/update', validateManagerController.handle, updateServiceShopController.handle)
router.get('/list', getServiceByBarberShopController.handle)




export { router as serviceRoutes }