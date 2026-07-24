import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, BookOpen, Play, Loader2, Zap } from 'lucide-react';
// @ts-ignore
import MoonModule from '../moon.js';

export default function Home() {
  const [showOutput, setShowOutput] = useState(false);
  const [engine, setEngine] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const showcaseCode = `let max of (a: Number) and (b: Number):
  give a if a > b else b
end

let x, y be 40, 30
show "Max of \`x\` and \`y\` is \`max of x and y\`"`;

  useEffect(() => {
    let instance: any = null;
    MoonModule({
      print: (text: string) => {
        setLogs(prev => [...prev, text]);
      },
      printErr: (text: string) => {
        setLogs(prev => [...prev, "Error: " + text]);
      }
    }).then((mod: any) => {
      instance = mod;
      if (instance._initMoonWeb) {
        instance._initMoonWeb();
      }
      setEngine(instance);
    });
  }, []);

  const runShowcase = async () => {
    if (!engine || isRunning) return;
    setShowOutput(true);
    setLogs([]);
    setIsRunning(true);
    
    try {
      if (engine._setCompilerFlags) {
        engine._setCompilerFlags(false, false, false, false);
      }
      const executeMoonCode = engine.cwrap('executeMoonCode', 'void', ['string'], { async: true });
      await executeMoonCode(showcaseCode);
    } catch (e: any) {
      setLogs(prev => [...prev, "Fatal Error: " + e.message]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col items-center overflow-x-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center -z-10">
        <div className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-moon-accent/20 rounded-full blur-[80px] md:blur-[120px] animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-[200px] md:w-[350px] h-[200px] md:h-[350px] bg-moon-purple/20 rounded-full blur-[70px] md:blur-[100px] animate-float right-1/4 top-1/4" style={{ animationDelay: '-5s' }}></div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-24 flex flex-col gap-16 md:gap-24">
        {/* Hero Section */}
        <header className="flex flex-col items-center text-center gap-6 mt-8 md:mt-16">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider uppercase text-moon-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            v1.0 is here
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
            Code that reads like a <span className="text-gradient">story.</span>
          </h1>
          <p className="text-base md:text-xl text-moon-muted max-w-2xl px-2 leading-relaxed">
            Moon is a revolutionary programming language that attempts to bridge the gap between natural human thought and raw computational power.
            Write logical, beautiful phrasal expressions backed by extreme performance.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full md:w-auto">
            <Link to="/tutorial" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 hover:scale-[1.02] transition-all">
              Read Tutorial <BookOpen size={18} />
            </Link>
            <Link to="/playground" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-moon-pane border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 hover:scale-[1.02] transition-all">
              Launch Playground <Code size={18} />
            </Link>
          </div>
        </header>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 md:p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-moon-accent/10 flex items-center justify-center text-moon-accent border border-moon-accent/20 group-hover:bg-moon-accent/20 transition-colors">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Natural Language Syntax</h3>
            <p className="text-moon-muted text-sm leading-relaxed">Write fluid, readable code with phrasal functions, sticky subjects, and chained comparisons that read exactly like English sentences.</p>
          </div>

          <div className="glass-panel p-6 md:p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-moon-purple/10 flex items-center justify-center text-moon-purple border border-moon-purple/20 group-hover:bg-moon-purple/20 transition-colors">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Dynamic Blueprints</h3>
            <p className="text-moon-muted text-sm leading-relaxed">Create robust custom data types with built-in active properties, and leverage multiple dispatch to seamlessly handle different structures.</p>
          </div>

          <div className="glass-panel p-6 md:p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
            <p className="text-moon-muted text-sm leading-relaxed">Compiled natively to C and WebAssembly, Moon delivers extreme performance without sacrificing the beauty of its syntax.</p>
          </div>
        </section>

        {/* Code Showcase */}
        <section className="glass-panel overflow-hidden flex flex-col w-full max-w-4xl mx-auto shadow-2xl shadow-black/50 border-t border-white/10">
          <div className="relative flex items-center justify-center px-4 py-3 bg-[#0a0f1d] border-b border-white/5">
            <div className="absolute left-4 flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <div className="text-xs font-mono text-moon-muted tracking-wider">max.moon</div>
            <button 
              className="absolute right-4 flex items-center gap-1.5 px-3 py-1.5 bg-moon-accent/10 border border-moon-accent/30 text-moon-accent text-xs font-bold rounded-lg hover:bg-moon-accent/20 hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              onClick={runShowcase} 
              disabled={!engine || isRunning}
            >
              {isRunning ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />} Run
            </button>
          </div>
          <pre className="p-4 md:p-6 overflow-x-auto">
            <code className="font-mono text-sm md:text-base leading-relaxed text-slate-200">
              {showcaseCode}
            </code>
          </pre>
          
          <div className={`bg-moon-pane border-t border-white/5 ${showOutput ? 'block animate-slide-down' : 'hidden'}`}>
            <div className="px-6 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 bg-[#020617] border-b border-white/5">
              Console Output
            </div>
            <div className="p-4 md:p-6 font-mono text-sm md:text-base text-slate-200 flex flex-col gap-2 min-h-[100px]">
              {logs.map((log, i) => (
                <div key={i} className="animate-fade-in" dangerouslySetInnerHTML={{__html: log}} />
              ))}
              {!isRunning && logs.length === 0 && showOutput && (
                <div className="text-slate-500 animate-fade-in">No output produced.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
