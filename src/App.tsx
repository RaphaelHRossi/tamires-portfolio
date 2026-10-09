import { AnimatePresence, MotionConfig } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router'
import { ContactTray } from '@/components/ContactTray'
import { Header } from '@/components/Header'
import { ContactProvider } from '@/context/ContactContext'
import { FlightProvider } from '@/context/FlightContext'
import { LightboxProvider } from '@/context/LightboxContext'
import About from '@/pages/About'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import ProjectPage from '@/pages/Project'

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <ContactProvider>
        <FlightProvider>
          <LightboxProvider>
            <Header />
            <AnimatePresence>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects/:slug" element={<ProjectPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            <ContactTray />
          </LightboxProvider>
        </FlightProvider>
      </ContactProvider>
    </MotionConfig>
  )
}
