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
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: any = null;
    MoonModule({
      print: (text: string) => setLogs(prev => [...prev, { text, isError: false }]),
      printErr: (text: string) => setLogs(prev => [...prev, { text, isError: true }])
    }).then((mod: any) => {
      instance = mod;
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
  }, [logs]);

  const runCode = () => {
    if (!engine) return;
    setLogs([]);
    try {
      const executeMoonCode = engine.cwrap('executeMoonCode', 'void', ['string']);
      executeMoonCode(code);
    } catch (e: any) {
      setLogs(prev => [...prev, { text: "Fatal Error: " + e.message, isError: true }]);
    }
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
          <button onClick={runCode} disabled={!engine}>Run</button>
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
      {logs.length > 0 && (
        <div className="runner-console" ref={consoleRef}>
          {logs.map((log, i) => (
            <div key={i} className={`log-line ${log.isError ? 'error' : ''}`} dangerouslySetInnerHTML={ansiToHtml(log.text)} />
          ))}
        </div>
      )}
    </div>
  );
}
