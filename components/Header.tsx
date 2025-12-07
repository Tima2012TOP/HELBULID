import React from 'react';
import { Sparkles, Download, Share2, Eye, Layout } from 'lucide-react';

interface HeaderProps {
  onPublish: () => void;
  viewMode: 'split' | 'chat' | 'preview';
  setViewMode: (mode: 'split' | 'chat' | 'preview') => void;
}

export const Header: React.FC<HeaderProps> = ({ onPublish, viewMode, setViewMode }) => {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          helbulid
        </h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
        <button
          onClick={() => setViewMode('chat')}
          className={`p-1.5 rounded-md transition-all ${viewMode === 'chat' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          title="Chat Only"
        >
          <Layout className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          title="Split View"
        >
          <div className="flex gap-0.5">
            <div className="w-2 h-4 border border-current rounded-[1px]"></div>
            <div className="w-2 h-4 border border-current rounded-[1px] bg-current"></div>
          </div>
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          title="Preview Only"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onPublish}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button 
          onClick={() => alert("Publishing to helbulid.cloud... (Demo Only)")}
          className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 text-zinc-950 rounded-lg text-sm font-semibold hover:bg-white transition-colors shadow-lg shadow-white/5"
        >
          <Share2 className="w-4 h-4" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
};
