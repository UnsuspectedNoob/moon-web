import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, BookOpen, Play, Loader2, Zap, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
// @ts-ignore
import MoonModule from '../moon.js';

const showcases = [
  {
    title: 'max.moon',
    code: `## MAX
   Returns the greater of two numbers.

let max of (a: Number) and (b: Number):
  give a if a > b else b
end

let x, y be 40, 30
show "Max of \`x\` and \`y\` is \`max of x and y\`"`
  },
  {
    title: 'palindrome.moon',
    code: `## PALINDROME
   Showcases Moon's elegant phrasal infix definitions:
   argument-led phrases, list casting, and '=' equality.

let (s: String) is a palindrome:
  let rev be join (reverse s as List) with ""
  give s = rev
end

show "--- Palindrome Algorithm ---"
let word be "racecar"
show "Is '\`word\`' a palindrome? \`word is a palindrome\`"

set word to "moon"
show "Is '\`word\`' a palindrome? \`word is a palindrome\`"`
  },
  {
    title: 'merge_sort.moon',
    code: `## MERGE SORT
   An expressive and recursive divide-and-conquer sorting algorithm.

let merge (left: List) with (right: List):
  let result be [ ]
  let i, j be 1
  let ll, rl be left's length, right's length

  until i > ll or j > rl:
    if left.i < right.j:
      add left.i to result
      update i + 1
    else:
      add right.j to result
      update j + 1
    end
  end

  add left[i to end] to result unless i > ll
  add right[j to end] to result unless j > rl

  give result
end

let a sorted (list: List):
  ## A list is always sorted if its length is 1 or less
  give list unless list's length > 1

  ## Split list into halves
  let left be list[1 to end / 2]
  let right be list[end / 2 + 1 to end]

  give merge a sorted left with a sorted right
end

let list be [ 5, 3, 10, 8, 2, 1, 15, 7, 14, 4 ]
show "List: \`list\`"
show "Sorted list: \`a sorted list\`"`
  },
  {
    title: 'fibonacci.moon',
    code: `## ITERATIVE FIBONACCI
   Showcases Moon's action statements, fast VM math, 
   and robust 'for' loops.

let fib_iterative (n):
  if n <= 1:
    give n
  end

  let a, b be 0, 1

  for i from 2 to n by 1:
    let temp be a + b
    set a to b
    set b to temp
  end

  give b
end

show "--- Fibonacci Algorithm ---"
show "Iterative (n=50):"
show fib_iterative 50`
  }
];

export default function Home() {
  const [showOutput, setShowOutput] = useState(false);
  const [engine, setEngine] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(0);

  const currentShowcase = showcases[currentShowcaseIndex];

  const handleNext = () => {
    setCurrentShowcaseIndex((prev) => (prev + 1) % showcases.length);
    setLogs([]);
    setShowOutput(false);
  };

  const handlePrev = () => {
    setCurrentShowcaseIndex((prev) => (prev - 1 + showcases.length) % showcases.length);
    setLogs([]);
    setShowOutput(false);
  };

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
      await executeMoonCode(currentShowcase.code);
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
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="text-moon-muted hover:text-white transition-colors" title="Previous Example">
                <ChevronLeft size={16} />
              </button>
              <div className="text-xs font-mono text-moon-muted tracking-wider min-w-[140px] text-center">
                {currentShowcase.title}
              </div>
              <button onClick={handleNext} className="text-moon-muted hover:text-white transition-colors" title="Next Example">
                <ChevronRight size={16} />
              </button>
            </div>
            <button
              className="absolute right-4 flex items-center gap-1.5 px-3 py-1.5 bg-moon-accent/10 border border-moon-accent/30 text-moon-accent text-xs font-bold rounded-lg hover:bg-moon-accent/20 hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              onClick={runShowcase}
              disabled={!engine || isRunning}
            >
              {isRunning ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />} Run
            </button>
          </div>
          <pre className="p-4 md:p-6 overflow-x-auto min-h-[300px]">
            <code className="font-mono text-sm md:text-base leading-relaxed text-slate-200">
              {currentShowcase.code}
            </code>
          </pre>

          <div className={`bg-moon-pane border-t border-white/5 ${showOutput ? 'block animate-slide-down' : 'hidden'}`}>
            <div className="px-6 py-2 flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 bg-[#020617] border-b border-white/5">
              <span>Console Output</span>
              <button
                onClick={() => { setLogs([]); setShowOutput(false); }}
                className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
                title="Clear Output"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <div className="p-4 md:p-6 font-mono text-sm md:text-base text-slate-200 flex flex-col gap-2 min-h-[100px]">
              {logs.map((log, i) => (
                <div key={i} className="animate-fade-in" dangerouslySetInnerHTML={{ __html: log }} />
              ))}
              {!isRunning && logs.length === 0 && showOutput && (
                <div className="text-slate-500 animate-fade-in">No output produced.</div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8 border-t border-white/5 pt-8">
          <p className="text-moon-muted text-sm flex items-center justify-center gap-2">
            View the C source code on
            <a
              href="https://github.com/UnsuspectedNoob/moon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-moon-accent font-semibold transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
