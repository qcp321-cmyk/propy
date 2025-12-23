import React, { useState, useRef, useEffect } from 'react';
import { Message, Property } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import { INITIAL_CHAT_MESSAGE } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatProps {
  properties: Property[];
}

const AIChat: React.FC<AIChatProps> = ({ properties }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: INITIAL_CHAT_MESSAGE, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const responseText = await generateChatResponse(inputText, properties);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 h-[420px] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-[140] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Propertyfie AI</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Verified Intel Concierge</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-lime-400 hover:text-black rounded-lg transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-none shadow-lg'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-none flex items-center gap-3">
                    <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                    <span className="text-[10px] text-slate-500 font-bold">Auditing Database...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about properties..."
                  className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="p-2 bg-violet-600 hover:bg-lime-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg shadow-violet-500/30 flex items-center justify-center z-[150] text-white hover:bg-lime-400 hover:text-black hover:shadow-lime-400/50 transition-all border border-white/10 ${isOpen ? 'bg-lime-400 text-black' : ''}`}
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div key="chat-close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                    <X className="w-6 h-6" />
                </motion.div>
            ) : (
                <motion.div key="chat-open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <MessageSquare className="w-6 h-6" />
                </motion.div>
            )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default AIChat;