import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Replaces Tambo's require('zod-to-json-schema') with ESM import so the client
 * bundle works in the browser (require is not defined in ESM/Vite builds).
 */
function tamboZodToJsonSchemaPlugin(): import('vite').Plugin {
  return {
    name: 'tambo-zod-to-json-schema',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!id.includes('@tambo-ai/react') || !id.includes('schema/zod')) return null
      if (!code.includes('require("zod-to-json-schema")')) return null
      const importLine = 'import { zodToJsonSchema } from "zod-to-json-schema";\n'
      if (code.includes('from "zod-to-json-schema"')) {
        return { code: code.replace(/const\s*\{\s*zodToJsonSchema\s*\}\s*=\s*require\s*\(\s*"zod-to-json-schema"\s*\)\s*;\s*\n\s*return\s+zodToJsonSchema\s*\(/g, 'return zodToJsonSchema('), map: null }
      }
      const firstLineEnd = code.indexOf('\n') + 1
      const withImport = code.slice(0, firstLineEnd) + importLine + code.slice(firstLineEnd)
      const out = withImport.replace(
        /const\s*\{\s*zodToJsonSchema\s*\}\s*=\s*require\s*\(\s*"zod-to-json-schema"\s*\)\s*;\s*\n\s*return\s+zodToJsonSchema\s*\(/g,
        'return zodToJsonSchema('
      )
      return { code: out, map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tamboZodToJsonSchemaPlugin(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['zod-to-json-schema'],
    // Don't pre-bundle Tambo so our transform runs on its source (fixes require in browser)
    exclude: ['@tambo-ai/react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@monaco-editor') || id.includes('monaco-editor')) return 'monaco'
            if (id.includes('three') || id.includes('@react-three')) return 'three'
            if (id.includes('@tambo-ai')) return 'tambo'
            // Only core React packages to avoid circular chunk (e.g. @radix-ui/react-* must stay in ui)
            if (id.includes('/react-dom/') || id.includes('/react-router') || (id.includes('/react/') && !id.includes('@radix-ui') && !id.includes('framer-motion'))) return 'react-vendor'
            if (id.includes('@radix-ui') || id.includes('framer-motion') || id.includes('cmdk')) return 'ui'
          }
        },
      },
    },
    chunkSizeWarningLimit: 850,
  },
})
