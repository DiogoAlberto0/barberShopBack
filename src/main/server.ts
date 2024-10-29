import { App } from "./app"

const PORT = process.env.PORT || 3000

const app = new App().app

app.listen(PORT, () => {
    console.log(`Executing on port: ${PORT}`)
})


