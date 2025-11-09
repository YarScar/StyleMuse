import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import TryOn from './features/TryOn/TryOn.jsx'
import Generator from './features/Generator/Generator.jsx'
import Gallery from './features/Gallery/Gallery.jsx'
import Closet from './features/Closet/Closet.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { I18nProvider } from './context/I18nContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/try-on" replace />} />
            <Route path="/try-on" element={<TryOn />} />
            <Route path="/generate" element={<Generator />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="*" element={<Navigate to="/try-on" replace />} />
          </Routes>
          <Footer />
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
