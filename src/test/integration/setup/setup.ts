import { beforeAll } from "vitest";
import { resetDb } from "./resetDb";
import { execSync } from "node:child_process";

beforeAll(async () => {
    await resetDb()
    execSync('npm run seed:test')
})