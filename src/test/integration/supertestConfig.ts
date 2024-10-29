import supertest from "supertest"
import { App } from "../../main/app"



const app = new App().app
export const request = supertest(app)