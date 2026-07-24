import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import MoonModule from '../moon.js';

interface CodeRunnerProps {
  initialCode: string;
}

export default function CodeRunner({ initialCode }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<{ text: string, isError: boolean }[]>([]);
  const [engine, setEngine] = useState<any>(null);
  
  // State for the interactive `ask` command
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [inputValue, setInputValue] = useState("");
  const resolveInputRef = useRef<((value: string) => void) | null>(null);

  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: any = null;
    MoonModule({
      print: (text: string) => setLogs(prev => [...prev, { text, isError: false }]),
      printErr: (text: string) => setLogs(prev => [...prev, { text, isError: true }])
    }).then((mod: any) => {
      instance = mod;
      
      // The ASYNCIFY bridge!
      instance.ask_handler = async (promptText: string) => {
        setCurrentPrompt(promptText);
        setIsWaitingInput(true);
        return new Promise<string>((resolve) => {
          resolveInputRef.current = resolve;
        });
      };

      if (instance._initMoonWeb) {
        instance._initMoonWeb();
      }
      setEngine(instance);
    }).catch((err: any) => {
      console.error("Runner init failed", err);
    });
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs, isWaitingInput]);

  const runCode = () => {
    if (!engine) return;
    setLogs([]);
    setIsWaitingInput(false);
    if (resolveInputRef.current) {
      resolveInputRef.current(""); // Abort any pending ask
      resolveInputRef.current = null;
    }
    
    try {
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
    <div className="bg-[#0a0f1d] border border-white/10 rounded-xl overflow-hidden shadow-2xl my-4">
      <div className="flex flex-col border-b border-white/5">
        <div className="flex justify-between items-center px-4 py-2 bg-[#020617] border-b border-white/5">
          <span className="text-xs font-mono text-moon-muted tracking-widest uppercase">Moon Snippet</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCode(initialCode)} 
              className="px-3 py-1 text-xs font-semibold text-moon-muted border border-white/10 rounded hover:bg-white/5 hover:text-white transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={runCode} 
              disabled={!engine || isWaitingInput}
              className="px-3 py-1 text-xs font-semibold bg-moon-accent text-[#020617] rounded hover:bg-moon-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Run
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck="false"
          autoComplete="off"
          rows={code.split('\n').length || 1}
          className="w-full bg-transparent p-4 font-mono text-sm text-slate-200 outline-none resize-none leading-relaxed"
        />
      </div>
      {(logs.length > 0 || isWaitingInput) && (
        <div className="bg-[#020617] p-4 max-h-[300px] overflow-y-auto font-mono text-sm" ref={consoleRef}>
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 break-words ${log.isError ? 'text-moon-error' : 'text-slate-300'}`} dangerouslySetInnerHTML={ansiToHtml(log.text)} />
          ))}
          {isWaitingInput && (
            <div className="flex gap-2 mt-2 items-center text-white">
              <span>{currentPrompt}</span>
              <input 
                autoFocus
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitInput(); }}
                className="bg-transparent border-b border-moon-accent text-moon-accent flex-1 outline-none font-mono focus:border-moon-accent-hover transition-colors"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
