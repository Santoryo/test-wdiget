import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [
    svelte(),
    tailwindcss(),
    {
      name: 'emit-demo-html',
      async closeBundle() {
        const distDir = join(process.cwd(), 'dist')
        const distFiles = await readdir(distDir)
        const jsFiles = distFiles.filter((file) => file.endsWith('.js'))
        const cssFiles = distFiles.filter((file) => file.endsWith('.css'))

        if (jsFiles.length !== 1 || cssFiles.length !== 1) {
          throw new Error(
            `Expected exactly one JS and one CSS in dist, got JS=${jsFiles.length}, CSS=${cssFiles.length}`
          )
        }

        const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chat Widget Demo</title>
    <link rel="stylesheet" href="./${cssFiles[0]}" />
  </head>
  <body style="margin: 0; padding: 16px; font-family: sans-serif;">
    <script src="./${jsFiles[0]}"></script>
    <script>
      ChatWidget.emitMessage("username", "my message");
      ChatWidget.emitMessage("username", "message 2");
      ChatWidget.emitAlert("username", "just subscribed");
    </script>
  </body>
</html>
`
        await writeFile(join(distDir, 'index.html'), html, 'utf8')
      }
    }
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: 'src/main.ts',
      name: 'ChatWidget',
      fileName: () => 'chatwidget.js',
      formats: ['iife'] // important for browser usage
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if ((assetInfo.name ?? '').endsWith('.css')) return 'chatwidget.css'
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  server: {
    port: 5173
  }
})
