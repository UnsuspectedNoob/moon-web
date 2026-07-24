import { Link } from 'react-router-dom';
import { Code, Zap, BookOpen } from 'lucide-react';
import './Home.css';

export default function Home() {
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
            Moon is a revolutionary programming language that bridges the gap between natural human thought and raw computational power. 
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
            <div className="window-title">phrasal-dispatch.moon</div>
          </div>
          <pre className="showcase-code">
            <code>
{`type Node: ip end
type Firewall: strength end

let breach system (target: Node):
  show "Hacking node at \`target's ip\`!"
end

let breach system (target: Firewall):
  show "Bypassing firewall with strength \`target's strength\`!"
end`}
            </code>
          </pre>
        </section>
      </main>
    </div>
  );
}
