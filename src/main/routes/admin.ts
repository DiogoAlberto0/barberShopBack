import { Router } from "express";
import { signinAdminController } from "../factories/adminFactory";

const router = Router()

router.post('/signin', signinAdminController.handle)

export { router as adminRoutes }