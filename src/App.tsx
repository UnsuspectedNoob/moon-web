import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Playground from './components/Playground'
import Tutorial from './components/Tutorial'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
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
