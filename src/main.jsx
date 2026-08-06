import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { queryClient } from '@/lib/queryClient'
import App from './App'
import './index.css'

/**
 * Application entry point.
 *
 * Provider hierarchy (outermost → innermost):
 * StrictMode → QueryClientProvider → AuthProvider → App (RouterProvider)
 *
 * React Query Devtools are only included in development builds.
 * Toaster is rendered here so it's always available regardless of route.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />

        {/* Global toast notification container */}
        <Toaster
          position="top-right"
          gutter={8}
          containerStyle={{ top: 72 }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#161616',
              color: '#f7f7f7',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
            },
            success: {
              iconTheme: {
                primary: '#16A34A',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>

      {/* TanStack Query Devtools — dev only */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  </StrictMode>
)
