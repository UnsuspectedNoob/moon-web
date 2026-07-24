import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/Home'
import Playground from './components/Playground'
import Tutorial, { chapters } from './components/Tutorial'
import { Menu } from 'lucide-react'
import './index.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <BrowserRouter>
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <nav className="sidebar">
          <div className="sidebar-header">
            <Link to="/" className="logo">
              <span className="moon-icon">🌙</span> M.O.O.N.
            </Link>
            <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
              <Menu size={20} />
            </button>
          </div>
          <div className="nav-links">
            <Link to="/playground" className="nav-link">Playground</Link>
            <div className="nav-group">
              <Link to="/tutorial" className="nav-link">Tutorial</Link>
              <div className="nav-sublinks">
                {chapters.map((chapter, i) => (
                  <Link key={i} to={`/tutorial#chapter-${i}`} className="nav-sublink">
                    {i + 1}. {chapter.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <main className="main-content">
          {!sidebarOpen && (
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
