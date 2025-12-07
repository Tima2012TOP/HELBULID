import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-zinc-500 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">What shall we build?</h3>
              <p className="text-sm max-w-xs mx-auto">
                Ask Helbulid to create a landing page, a dashboard, or a portfolio. 
                Powered by Gemini 3 Pro.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {['Landing page for a coffee shop', 'Crypto dashboard dark mode', 'Personal portfolio', 'Login form with glassmorphism'].map((suggestion) => (
                    <button 
                        key={suggestion}
                        onClick={() => onSendMessage(suggestion)}
                        className="text-xs p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm'
                    : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-xs text-zinc-400">Thinking & Generating Code...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your site (e.g., 'Modern landing page for a sushi restaurant')..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <div className="mt-2 flex justify-between items-center px-1">
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini 3 Pro Preview Active
            </span>
             <span className="text-[10px] text-zinc-600">
                Helbulid v1.0
            </span>
        </div>
      </div>
    </div>
  );
};
