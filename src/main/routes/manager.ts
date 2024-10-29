import { Router } from 'express'
import { signinManagerController, createManagerController, getAllManagerController, updateManagerController } from '../factories/managerFactory'
import { validateAdminController } from '../factories/adminFactory'


const router = Router()

router.post('/signin', signinManagerController.handle)

router.post('/create', validateAdminController.handle, createManagerController.handle)

router.get('/all', validateAdminController.handle, getAllManagerController.handle)

router.put('/update/:id', validateAdminController.handle, updateManagerController.handle)


export { router as managerRoutes }                                              