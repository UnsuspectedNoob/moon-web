import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Playground from './components/Playground'
import Tutorial from './components/Tutorial'
import { Menu } from 'lucide-react'
import './index.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <BrowserRouter>
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <nav className="sidebar">
          <div className="logo">
            <span className="moon-icon">🌙</span> M.O.O.N.
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Playground</Link>
            <Link to="/tutorial" className="nav-link">Tutorial</Link>
          </div>
        </nav>
        <main className="main-content">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <Routes>
            <Route path="/" element={<Playground />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
