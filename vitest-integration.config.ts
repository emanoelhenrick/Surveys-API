import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**\/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ["./setup/mongo-memory-server.ts"]
  }
})