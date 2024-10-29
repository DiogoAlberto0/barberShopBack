import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

export default defineConfig({
    test: {
        include: ['**/*.integration.test.ts'],
        setupFiles: ['src/test/integration/setup/setup.ts'],
        fileParallelism: false,
        // poolOptions: {
        //     threads: {
        //         singleThread: true
        //     }
        // }
    }
})