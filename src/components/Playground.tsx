import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import MoonModule from '../moon.js';
import ASTViewer from './ASTViewer';
import { Play } from 'lucide-react';

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
    html = html.replace(/\x1b\[1;31m/g, '<span class="text-moon-error font-bold">')
      .replace(/\x1b\[1;32m/g, '<span class="text-emerald-500 font-bold">')
      .replace(/\x1b\[1;33m/g, '<span class="text-amber-500 font-bold">')
      .replace(/\x1b\[1;36m/g, '<span class="text-moon-accent font-bold">')
      .replace(/\x1b\[90m/g, '<span class="text-moon-muted">')
      .replace(/\x1b\[0m/g, '</span>');
    html = html.replace(/\[1;31m/g, '<span class="text-moon-error font-bold">')
      .replace(/\[1;32m/g, '<span class="text-emerald-500 font-bold">')
      .replace(/\[1;33m/g, '<span class="text-amber-500 font-bold">')
      .replace(/\[1;36m/g, '<span class="text-moon-accent font-bold">')
      .replace(/\[90m/g, '<span class="text-moon-muted">')
      .replace(/\[0m/g, '</span>');
    return { __html: html };
  };

  return (
    <div className="flex flex-col h-full bg-moon-bg">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-white/5 gap-4">
        <h2 className="text-xl font-bold tracking-tight">Interactive Playground</h2>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <label className="flex items-center gap-3 cursor-pointer group">
            <span className="text-sm font-medium text-moon-muted group-hover:text-white transition-colors">Parse AST</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={showAST} 
                onChange={e => {
                  const checked = e.target.checked;
                  setShowAST(checked);
                  if (!checked && activeTab === 'ast') {
                    setActiveTab('output');
                  }
                }}
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-moon-accent transition-colors"></div>
            </div>
          </label>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-moon-accent text-[#020617] font-bold rounded-lg hover:bg-moon-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={runCode} 
            disabled={!engine || isWaitingInput}
          >
            <Play size={16} /> Run Code
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Editor Pane */}
        <div className="flex flex-col flex-1 h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-white/5 min-w-0">
          <div className="px-4 py-2 text-xs font-mono font-bold tracking-widest text-moon-muted uppercase bg-moon-pane border-b border-white/5">
            Source Code
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[#0a0f1d]">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
              autoComplete="off"
              className="w-full h-full min-h-[300px] bg-transparent text-slate-200 font-mono text-sm leading-relaxed outline-none resize-none"
            />
          </div>
        </div>

        {/* Console Pane */}
        <div className="flex flex-col flex-1 h-[50vh] lg:h-full min-w-0 bg-[#020617]">
          <div className="flex border-b border-white/5 bg-moon-pane">
            <button 
              className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'output' ? 'border-moon-accent text-white' : 'border-transparent text-moon-muted hover:text-white'}`}
              onClick={() => setActiveTab('output')}
            >
              Output
            </button>
            {showAST && (
              <button 
                className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'ast' ? 'border-moon-purple text-white' : 'border-transparent text-moon-muted hover:text-white'}`}
                onClick={() => setActiveTab('ast')}
              >
                AST Tree
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed" ref={consoleRef}>
            {activeTab === 'output' ? (
              <div className="flex flex-col gap-1.5">
                {logs.map((log, i) => (
                  <div key={i} className={`break-words ${log.isError ? 'text-moon-error' : 'text-slate-300'}`} dangerouslySetInnerHTML={ansiToHtml(log.text)} />
                ))}
                {isWaitingInput && (
                  <div className="flex gap-2 mt-2 text-white items-center">
                    <span>{currentPrompt}</span>
                    <input 
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') submitInput(); }}
                      className="bg-transparent border-b border-moon-accent text-moon-accent outline-none flex-1 font-mono focus:border-moon-accent-hover transition-colors"
                    />
                  </div>
                )}
              </div>
            ) : (
              <ASTViewer logs={astLogs} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
