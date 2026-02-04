import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { tamboComponents } from './config/tambo-components'
import './index.css'
import App from './App'
import { TamboProvider } from '@tambo-ai/react'

const tamboApiKey = import.meta.env.VITE_TAMBO_API_KEY as string | undefined

// Suppress Tambo SDK "Overwriting tool ..." console noise (tool re-registration on
// component/route changes). Real errors still show.
const originalError = console.error
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '')
  if (msg.includes('Overwriting tool')) return
  originalError.apply(console, args)
}

createRoot(document.getElementById('root')!).render(
  <TamboProvider apiKey={tamboApiKey ?? ''} components={tamboComponents}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </TamboProvider>,
)
