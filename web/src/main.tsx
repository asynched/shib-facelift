import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import App from '@/App.tsx'

import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
      <ToastContainer position="bottom-right" theme="dark" />
    </QueryClientProvider>
  </React.StrictMode>,
)
