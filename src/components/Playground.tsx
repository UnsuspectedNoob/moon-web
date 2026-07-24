import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import MoonModule from '../moon.js';
import ASTViewer from './ASTViewer';

export default function Playground() {
  const [code, setCode] = useState('let message be "Hello from WebAssembly!"\nshow message\n\nlet count be 1\nfor i from 1 to 5:\n  show "Counting: `count`"\n  update count + 1\nend\n');
  const [logs, setLogs] = useState<{ text: string, isError: boolean }[]>([]);
  const [astLogs, setAstLogs] = useState<string[]>([]);
  const [showAST, setShowAST] = useState(true);
  const [activeTab, setActiveTab] = useState<'output' | 'ast'>('output');
  const [engine, setEngine] = useState<any>(null);
  
  // State for the interactive `ask` command
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [inputValue, setInputValue] = useState("");
  const resolveInputRef = useRef<((value: string) => void) | null>(null);

  const consoleRef = useRef<HTMLDivElement>(null);
  const isAstLineRef = useRef(false);

  useEffect(() => {
    let instance: any = null;
    MoonModule({
      print: (text: string) => {
        if (text === "=== ABSTRACT SYNTAX TREE ===") {
          isAstLineRef.current = true;
          return;
        }
        if (text === "============================") {
          isAstLineRef.current = false;
          return;
        }
        if (isAstLineRef.current) {
          setAstLogs(prev => [...prev, text]);
        } else {
          setLogs(prev => [...prev, { text, isError: false }]);
        }
      },
      printErr: (text: string) => setLogs(prev => [...prev, { text, isError: true }]),
      onAbort: (what: any) => {
        console.error("MoonModule Aborted:", what);
        setLogs(prev => [...prev, { text: "Engine aborted: " + what, isError: true }]);
      }
    }).then((mod: any) => {
      instance = mod;

      // The ASYNCIFY bridge
      instance.ask_handler = async (promptText: string) => {
        setCurrentPrompt(promptText);
        setIsWaitingInput(true);
        // If we switch to AST, switch back to output to show prompt
        if (activeTab === 'ast') setActiveTab('output');
        return new Promise<string>((resolve) => {
          resolveInputRef.current = resolve;
        });
      };

      if (instance._initMoonWeb) {
        instance._initMoonWeb();
      }
      setEngine(instance);
      setLogs([{ text: "🌙 M.O.O.N. Engine initialized successfully.", isError: false }]);
    }).catch((err: any) => {
      console.error(err);
      setLogs([{ text: "Failed to initialize engine.", isError: true }]);
    });
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs, isWaitingInput, activeTab]);

  const runCode = () => {
    if (!engine) return;
    setLogs([]); // Clear
    setAstLogs([]);
    setIsWaitingInput(false);
    if (resolveInputRef.current) {
      resolveInputRef.current(""); // Abort pending ask
      resolveInputRef.current = null;
    }
    
    try {
      if (engine._setCompilerFlags) {
        engine._setCompilerFlags(showAST, false, false, false);
      }
      const executeMoonCode = engine.cwrap('executeMoonCode', 'void', ['string'], { async: true });
      executeMoonCode(code);
    } catch (e: any) {
      setLogs(prev => [...prev, { text: "Fatal Error: " + e.message, isError: true }]);
    }
  };

  const submitInput = () => {
    if (resolveInputRef.current) {
      resolveInputRef.current(inputValue);
      setLogs(prev => [...prev, { text: currentPrompt + inputValue, isError: false }]);
      resolveInputRef.current = null;
    }
    setInputValue("");
    setIsWaitingInput(false);
  };

  const ansiToHtml = (text: string) => {
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/\x1b\[1;31m/g, '<span style="color: #f43f5e; font-weight: bold;">')
      .replace(/\x1b\[1;32m/g, '<span style="color: #10b981; font-weight: bold;">')
      .replace(/\x1b\[1;33m/g, '<span style="color: #f59e0b; font-weight: bold;">')
      .replace(/\x1b\[1;36m/g, '<span style="color: #38bdf8; font-weight: bold;">')
      .replace(/\x1b\[90m/g, '<span style="color: #94a3b8;">')
      .replace(/\x1b\[0m/g, '</span>');
    html = html.replace(/\[1;31m/g, '<span style="color: #f43f5e; font-weight: bold;">')
      .replace(/\[1;32m/g, '<span style="color: #10b981; font-weight: bold;">')
      .replace(/\[1;33m/g, '<span style="color: #f59e0b; font-weight: bold;">')
      .replace(/\[1;36m/g, '<span style="color: #38bdf8; font-weight: bold;">')
      .replace(/\[90m/g, '<span style="color: #94a3b8;">')
      .replace(/\[0m/g, '</span>');
    return { __html: html };
  };

  return (
    <div className="playground-layout">
      <header className="playground-header">
        <div className="header-left">
          <h2>Interactive Playground</h2>
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            <input 
              type="checkbox" 
              checked={showAST} 
              onChange={e => setShowAST(e.target.checked)} 
            />
            Parse AST
          </label>
          <button className="run-btn" onClick={runCode} disabled={!engine || isWaitingInput}>Run Code</button>
        </div>
      </header>
      <main className="split-view">
        <div className="editor-pane">
          <div className="pane-header">Source Code</div>
          <div className="editor-scroll-container">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
              autoComplete="off"
              className="code-editor"
              rows={Math.max(code.split('\n').length, 15)}
            />
          </div>
        </div>
        <div className="console-pane">
          <div className="pane-tabs" style={{ display: 'flex', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <button 
              className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
              onClick={() => setActiveTab('output')}
              style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'output' ? '2px solid #38bdf8' : '2px solid transparent', color: activeTab === 'output' ? '#e2e8f0' : '#64748b', cursor: 'pointer', outline: 'none' }}
            >
              Output
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ast' ? 'active' : ''}`}
              onClick={() => setActiveTab('ast')}
              style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'ast' ? '2px solid #c084fc' : '2px solid transparent', color: activeTab === 'ast' ? '#e2e8f0' : '#64748b', cursor: 'pointer', outline: 'none' }}
            >
              AST Tree
            </button>
          </div>
          <div className="console-output" ref={consoleRef} style={{ height: 'calc(100% - 46px)' }}>
            {activeTab === 'output' ? (
              <>
                {logs.map((log, i) => (
                  <div key={i} className={`log-line ${log.isError ? 'error' : ''}`} dangerouslySetInnerHTML={ansiToHtml(log.text)} />
                ))}
                {isWaitingInput && (
                  <div className="runner-input-line" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', color: '#fff' }}>
                    <span>{currentPrompt}</span>
                    <input 
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') submitInput(); }}
                      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #38bdf8', color: '#38bdf8', outline: 'none', flex: 1, fontFamily: 'monospace' }}
                    />
                  </div>
                )}
              </>
            ) : (
              <ASTViewer logs={astLogs} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
