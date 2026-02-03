import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { tamboComponents } from './config/tambo-components'
import './index.css'
import App from './App'
import { TamboProvider } from '@tambo-ai/react'

const tamboApiKey = import.meta.env.VITE_TAMBO_API_KEY as string | undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamboProvider apiKey={tamboApiKey ?? ''} components={tamboComponents}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </TamboProvider>
  </StrictMode>,
)
