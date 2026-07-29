import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/Home'
import Playground from './components/Playground'
import Tutorial, { chapters } from './components/Tutorial'
import { Menu, X, ChevronDown, Terminal, GraduationCap, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import './index.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
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
          fixed inset-y-0 left-0 z-50 bg-moon-pane border-r border-moon-border
          transform transition-all duration-300 ease-in-out
          md:relative md:translate-x-0 flex flex-col
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          ${desktopSidebarOpen ? 'md:w-64' : 'md:w-16'}
        `}>
          <div className={`flex items-center p-6 border-b border-white/5 h-[73px] ${desktopSidebarOpen ? 'justify-between' : 'justify-center md:px-0'}`}>
            <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
              <span className="text-moon-accent text-2xl">🌙</span> 
              <span className={desktopSidebarOpen ? '' : 'md:hidden'}>M.O.O.N.</span>
            </Link>
            <button 
              className="md:hidden text-moon-muted hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 px-4">
            <Link 
              to="/playground" 
              className={`flex items-center gap-3 py-2 rounded-lg text-sm font-semibold text-moon-muted hover:text-white hover:bg-white/5 transition-colors ${desktopSidebarOpen ? 'px-4' : 'justify-center px-0'}`}
              onClick={() => setSidebarOpen(false)}
              title={!desktopSidebarOpen ? "Playground" : ""}
            >
              <Terminal size={20} className="shrink-0" />
              <span className={desktopSidebarOpen ? '' : 'md:hidden'}>Playground</span>
            </Link>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  if (!desktopSidebarOpen) {
                    setDesktopSidebarOpen(true)
                    setTutorialDropdownOpen(true)
                  } else {
                    setTutorialDropdownOpen(!tutorialDropdownOpen)
                  }
                }}
                className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-semibold text-moon-muted hover:text-white hover:bg-white/5 transition-colors ${desktopSidebarOpen ? 'px-4 justify-between' : 'justify-center px-0'}`}
                title={!desktopSidebarOpen ? "Tutorial" : ""}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap size={20} className="shrink-0" />
                  <span className={desktopSidebarOpen ? '' : 'md:hidden'}>Tutorial</span>
                </div>
                {desktopSidebarOpen && <ChevronDown size={16} className={`transform transition-transform ${tutorialDropdownOpen ? 'rotate-180' : ''}`} />}
              </button>
              
              <div className={`flex flex-col gap-1 pl-4 border-l-2 border-white/5 ml-6 overflow-hidden transition-all duration-300 ${tutorialDropdownOpen && desktopSidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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

          <div className="hidden md:flex p-4 border-t border-white/5">
            <button 
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)} 
              className="p-2 w-full flex justify-center rounded-lg text-moon-muted hover:text-white hover:bg-white/5 transition-colors"
              title={desktopSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {desktopSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
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
