import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1520',
              color: '#e2e8f0',
              border: '1px solid rgba(0,229,255,0.2)',
              fontFamily: '"DM Sans", sans-serif',
            },
            success: { iconTheme: { primary: '#00ff9d', secondary: '#0d1520' } },
            error: { iconTheme: { primary: '#ff4d6d', secondary: '#0d1520' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
