import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, Subject } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Send, Loader2, Mic } from 'lucide-react';
import { SUBJECT_CONFIG } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  currentSubject: Subject;
  onSendMessage: (text: string) => void;
  onToggleLive: () => void;
  isLive: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isLoading, 
  currentSubject, 
  onSendMessage,
  onToggleLive,
  isLive
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConfig = SUBJECT_CONFIG[currentSubject];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
     inputRef.current?.focus();
  }, [currentSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
            <activeConfig.icon className={`w-16 h-16 ${activeConfig.textColor} opacity-20 mb-4`} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to {currentSubject}</h3>
            <p className="max-w-md">
              Your AI consultant is ready.
            </p>
            <div className="mt-8 flex gap-3">
                <button onClick={onToggleLive} className={`flex items-center gap-2 px-6 py-3 ${activeConfig.color} text-white rounded-full hover:opacity-90 shadow-lg shadow-blue-100 transition-all transform hover:scale-105`}>
                    <Mic size={18} />
                    {isLive ? 'Stop Voice Conversation' : 'Start Voice Conversation'}
                </button>
            </div>
            <p className="mt-4 text-xs text-gray-400">Great for: Active Recall & Explaining Concepts</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === Role.USER
                  ? `${activeConfig.color} text-white rounded-br-none`
                  : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              {msg.role === Role.USER ? (
                 <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                 <MarkdownRenderer content={msg.text} />
              )}
              <div className={`text-[10px] mt-1 opacity-70 ${msg.role === Role.USER ? 'text-blue-100 text-right' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 rounded-2xl rounded-bl-none px-5 py-4 border border-gray-100 flex items-center gap-2">
              <Loader2 className={`w-4 h-4 animate-spin ${activeConfig.textColor}`} />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex gap-2">
            <button
                type="button"
                onClick={onToggleLive}
                className={`p-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm group ${isLive ? 'bg-red-50 border-red-200 text-red-500' : ''}`}
                title={isLive ? "Stop Voice Chat" : "Start Voice Chat"}
            >
                <Mic className={`w-5 h-5 ${isLive ? 'animate-pulse' : 'group-hover:text-blue-600'}`} />
            </button>
            <div className="relative flex-1">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Ask about ${currentSubject}...`}
                    className="w-full pl-4 pr-12 py-3.5 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    disabled={isLoading || isLive}
                />
            </div>
            <button
                type="submit"
                disabled={!inputText.trim() || isLoading || isLive}
                className={`px-5 rounded-xl flex items-center justify-center transition-all ${
                    !inputText.trim() || isLoading || isLive
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : `${activeConfig.color} text-white hover:opacity-90 shadow-md`
                }`}
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;