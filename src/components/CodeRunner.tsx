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
    <div className="code-runner">
      <div className="runner-editor">
        <div className="runner-header">
          <span>Moon Snippet</span>
          <div className="runner-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setCode(initialCode)} className="btn-reset" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Reset</button>
            <button onClick={runCode} disabled={!engine || isWaitingInput}>Run</button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck="false"
          autoComplete="off"
          rows={code.split('\n').length || 1}
          className="code-editor"
        />
      </div>
      {(logs.length > 0 || isWaitingInput) && (
        <div className="runner-console" ref={consoleRef}>
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
        </div>
      )}
    </div>
  );
}
