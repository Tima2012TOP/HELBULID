import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { PreviewWindow } from './components/PreviewWindow';
import { generateWebsiteCode } from './services/geminiService';
import { Message, ViewMode } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [codeVersion, setCodeVersion] = useState(0);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Generate code
      const code = await generateWebsiteCode(content, generatedCode);
      
      setGeneratedCode(code);
      setCodeVersion(v => v + 1);

      // Add AI response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've updated the preview with your request. Let me know if you want to change anything!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      // If on mobile/tablet, might want to auto-switch to preview
      if (window.innerWidth < 768) {
          setViewMode('preview');
      }

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error while generating the code. Please ensure your API Key is valid.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    if (!generatedCode) return;
    
    // Create a blob and download it
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'helbulid-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Header 
        onPublish={handlePublish} 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Chat Panel */}
        <div 
          className={`
            transition-all duration-300 ease-in-out h-full
            ${viewMode === 'chat' ? 'w-full' : ''}
            ${viewMode === 'split' ? 'w-1/3 min-w-[350px] border-r border-zinc-800' : ''}
            ${viewMode === 'preview' ? 'w-0 opacity-0 overflow-hidden' : ''}
          `}
        >
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
          />
        </div>

        {/* Preview Panel */}
        <div 
          className={`
            transition-all duration-300 ease-in-out h-full bg-zinc-900
            ${viewMode === 'preview' ? 'w-full' : ''}
            ${viewMode === 'split' ? 'w-2/3' : ''}
            ${viewMode === 'chat' ? 'w-0 opacity-0 overflow-hidden' : ''}
          `}
        >
          <PreviewWindow code={generatedCode} version={codeVersion} />
        </div>
      </main>
    </div>
  );
}

export default App;
