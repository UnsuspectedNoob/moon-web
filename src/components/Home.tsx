import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, Zap, BookOpen, Play, Loader2 } from 'lucide-react';
// @ts-ignore
import MoonModule from '../moon.js';
import './Home.css';

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
    <div className="home-container">
      <div className="ambient-background">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <main className="home-content">
        <header className="hero-section">
          <div className="hero-badge">v1.0 is here</div>
          <h1 className="hero-title">
            Code that reads like a <span className="text-gradient">story.</span>
          </h1>
          <p className="hero-subtitle">
            Moon is a revolutionary programming language that attempts to bridge the gap between natural human thought and raw computational power.
            Write logical, beautiful phrasal expressions backed by extreme performance.
          </p>
          <div className="hero-actions">
            <Link to="/tutorial" className="btn-primary">
              Read Tutorial <BookOpen size={18} />
            </Link>
            <Link to="/playground" className="btn-secondary">
              Launch Playground <Code size={18} />
            </Link>
          </div>
        </header>

        <section className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <BookOpen className="feature-icon" size={24} />
            </div>
            <h3>Natural Language Syntax</h3>
            <p>Write fluid, readable code with phrasal functions, sticky subjects, and chained comparisons that read exactly like English sentences.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Code className="feature-icon" size={24} />
            </div>
            <h3>Dynamic Blueprints</h3>
            <p>Create robust custom data types with built-in active properties, and leverage multiple dispatch to seamlessly handle different structures.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Zap className="feature-icon" size={24} />
            </div>
            <h3>Lightning Fast</h3>
            <p>Compiled natively to C and WebAssembly, Moon delivers extreme performance without sacrificing the beauty of its syntax.</p>
          </div>
        </section>

        <section className="code-showcase glass-panel">
          <div className="showcase-header">
            <div className="window-controls">
              <span></span><span></span><span></span>
            </div>
            <div className="window-title">max.moon</div>
            <button className="showcase-run-btn" onClick={runShowcase} disabled={!engine || isRunning}>
              {isRunning ? <Loader2 className="spinner" size={14} /> : <Play size={14} />} Run
            </button>
          </div>
          <pre className="showcase-code">
            <code>
              {showcaseCode}
            </code>
          </pre>

          <div className={`showcase-output-box ${showOutput ? 'visible' : ''}`}>
            <div className="output-header">Console Output</div>
            <div className="output-content">
              {logs.map((log, i) => (
                <div key={i} className="output-line" dangerouslySetInnerHTML={{__html: log}} />
              ))}
              {!isRunning && logs.length === 0 && showOutput && (
                <div className="output-line" style={{ color: '#94a3b8' }}>No output produced.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
