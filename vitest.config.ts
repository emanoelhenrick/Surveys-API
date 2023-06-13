import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**\/*.{spec,test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/src/main/**', '**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']
  }
})