import 'reflect-metadata'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import './index.css'
import { ConsoleProvider } from './ConsoleArea/ConsoleContext'

const rootElement = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootElement!)

root.render(
  <React.StrictMode>
    <HashRouter>
      <ConsoleProvider>
        <AppRoutes />
      </ConsoleProvider>
    </HashRouter>
  </React.StrictMode>
)
