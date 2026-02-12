
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ZenAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

const ZenAIChat: React.FC<ZenAIChatProps> = ({ isOpen, onClose, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${currentUser.name.split(' ')[0]}! I'm ZenAI, your intelligence layer. How can I help you clear the chaos today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are ZenAI, a highly intelligent and helpful project management assistant for the ZenSpace app. You help users organize tasks, brainstorm ideas, and summarize project progress. Be concise, professional, and supportive.',
        }
      });

      // Prepare history
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const streamResponse = await chat.sendMessageStream({ message: userMessage });
      
      let assistantResponse = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of streamResponse) {
        const text = chunk.text;
        if (text) {
          assistantResponse += text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: assistantResponse }];
          });
        }
      }
    } catch (error) {
      console.error('ZenAI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error connecting to my neural core. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end md:p-6 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl h-full md:h-[90vh] glass-card rounded-none md:rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter leading-none">ZenAI Assistant</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Intelligence Active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-50/30 dark:bg-black/10"
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' 
                  : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[85%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-[2rem] text-sm leading-relaxed shadow-sm font-medium ${
                  msg.role === 'user' 
                    ? 'bg-white dark:bg-zinc-800 rounded-tr-none' 
                    : 'bg-blue-600 text-white rounded-tl-none'
                }`}>
                  {msg.content || (isTyping && idx === messages.length - 1 ? <Loader2 size={18} className="animate-spin" /> : null)}
                </div>
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length - 1].role === 'user' && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center bg-blue-600 text-white shadow-lg">
                <Bot size={20} />
              </div>
              <div className="p-4 bg-blue-600 text-white rounded-[2rem] rounded-tl-none shadow-sm flex items-center justify-center">
                <Loader2 size={18} className="animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-white/5">
          <form onSubmit={handleSend} className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ZenAI anything..."
              disabled={isTyping}
              className="w-full glass-inset !bg-white dark:!bg-white/5 p-4 pr-14 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all border-zinc-200 dark:border-white/10"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
             <button type="button" onClick={() => setInput("Summarize my tasks")} className="hover:text-blue-500 transition-colors">Summarize Tasks</button>
             <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
             <button type="button" onClick={() => setInput("Brainstorm project goals")} className="hover:text-blue-500 transition-colors">Brainstorm Goals</button>
             <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
             <button type="button" onClick={() => setInput("Help with Roadmap")} className="hover:text-blue-500 transition-colors">Plan Roadmap</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenAIChat;
