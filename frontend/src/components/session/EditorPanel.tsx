'use client';

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Socket } from 'socket.io-client';
import { Code2, Settings, Play, CheckCircle } from 'lucide-react';

export const EditorPanel = ({ socket, language = 'javascript' }: { socket: Socket | null, language?: string }) => {
  const [value, setValue] = useState('// Welcome to MentorSpace Session\n// Start coding with your mentor...\n\nfunction main() {\n  console.log("Hello World");\n}');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on('editor-sync', (data: { content: string; version: number }) => {
      setValue(data.content);
      setVersion(data.version);
    });

    socket.on('editor-change', (data: { content: string; version: number }) => {
      setValue(data.content);
      setVersion(data.version);
    });

    return () => {
      socket.off('editor-sync');
      socket.off('editor-change');
    };
  }, [socket]);

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue === undefined || !socket) return;
    
    const newVersion = version + 1;
    setValue(newValue);
    setVersion(newVersion);
    
    socket.emit('editor-change', { 
      content: newValue, 
      version: newVersion 
    });
  };

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-white/50 uppercase tracking-widest">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-md border border-green-500/20 text-[10px] text-green-400 font-bold">
            <CheckCircle className="w-3 h-3" /> LIVE SYNC
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-white/30" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
            <Play className="w-3 h-3 fill-current" /> RUN
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-[#050810]">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            cursorStyle: 'block',
            wordWrap: 'on',
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden'
            },
            padding: { top: 20 },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderLineHighlight: 'all',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
};
