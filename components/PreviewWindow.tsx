import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw, Maximize2 } from 'lucide-react';
import { DeviceView } from '../types';

interface PreviewWindowProps {
  code: string;
  version: number;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code, version }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<DeviceView>('desktop');
  const [iframeKey, setIframeKey] = useState(0); // Force re-render if needed

  // Update iframe content when code changes
  useEffect(() => {
    const updateIframe = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        // We can write to the document directly for immediate updates
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(code);
          doc.close();
        }
      }
    };

    // Small timeout to ensure iframe is mounted/ready
    const timer = setTimeout(updateIframe, 50);
    return () => clearTimeout(timer);
  }, [code, iframeKey]);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop': return 'max-w-full';
      default: return 'max-w-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50">
      {/* Preview Toolbar */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-950">
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded ${device === 'mobile' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded ${device === 'tablet' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded ${device === 'desktop' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          {code ? (
            <span className="flex items-center gap-1.5 text-green-500/80">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Preview
            </span>
          ) : (
            <span>Waiting for code...</span>
          )}
          <div className="h-4 w-px bg-zinc-800 mx-2"></div>
           <button 
            onClick={handleRefresh}
            className="hover:text-white transition-colors"
            title="Reload Frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 overflow-hidden relative flex justify-center bg-zinc-900/50 p-4">
        {code ? (
             <div className={`w-full h-full transition-all duration-300 ease-in-out shadow-2xl ${getContainerWidth()} bg-white rounded-lg overflow-hidden border border-zinc-800/50`}>
                <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    title="Helbulid Preview"
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-modals allow-same-origin allow-forms" // Safety settings
                />
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-zinc-600 space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                    <Maximize2 className="w-10 h-10 opacity-20" />
                </div>
                <p>Generated website will appear here</p>
            </div>
        )}
      </div>
    </div>
  );
};
