import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/Home'
import Playground from './components/Playground'
import Tutorial, { chapters } from './components/Tutorial'
import { Menu, X, ChevronDown } from 'lucide-react'
import './index.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tutorialDropdownOpen, setTutorialDropdownOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-moon-bg text-moon-text overflow-hidden">
        
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-moon-pane border-r border-moon-border
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
              <span className="text-moon-accent text-2xl">🌙</span> M.O.O.N.
            </Link>
            <button 
              className="md:hidden text-moon-muted hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
            <Link 
              to="/playground" 
              className="block px-4 py-2 rounded-lg text-sm font-semibold text-moon-muted hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Playground
            </Link>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setTutorialDropdownOpen(!tutorialDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-semibold text-moon-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>Tutorial</span>
                <ChevronDown size={16} className={`transform transition-transform ${tutorialDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`flex flex-col gap-1 pl-4 border-l-2 border-white/5 ml-6 overflow-hidden transition-all duration-300 ${tutorialDropdownOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {chapters.map((chapter, i) => (
                  <Link 
                    key={i} 
                    to={`/tutorial#chapter-${i + 1}`} 
                    className="block px-4 py-1.5 text-xs text-moon-muted hover:text-moon-accent transition-colors truncate"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {i + 1}. {chapter.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 relative flex flex-col w-full h-full min-w-0 overflow-hidden">
          {/* Mobile Header / Toggle */}
          <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-moon-pane/50 backdrop-blur-md absolute top-0 left-0 right-0 z-30">
            <button 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="ml-4 font-bold tracking-tight text-white">M.O.O.N.</span>
          </div>

          {/* Page Container */}
          <div className="flex-1 overflow-y-auto md:pt-0 pt-16 h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/tutorial" element={<Tutorial />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
