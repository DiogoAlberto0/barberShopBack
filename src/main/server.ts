import { App } from "./app"
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const PORT = process.env.PORT || 3000

const app = new App().app

app.listen(PORT, () => {
    console.log(`Executing on port: ${PORT}`)
})


