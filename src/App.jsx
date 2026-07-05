import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Results from './pages/Results'
import Schedule from './pages/Schedule'
import Standings from './pages/Standings'
import Watch from './pages/Watch'

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--color-signal)] focus:px-4 focus:py-2 focus:text-[var(--color-ink)]"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/watch" element={<Watch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
