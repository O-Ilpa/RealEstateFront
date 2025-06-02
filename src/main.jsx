import { HelmetProvider } from 'react-helmet-async';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './components/contextApi.jsx'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </HelmetProvider>,
)