import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, MessageSquare, X, Send, Loader2, 
  RotateCcw, Sparkles, User, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { AIChatMessage } from '../../types';

interface CivicAiAssistantProps {
  currentRole: 'citizen' | 'officer' | 'admin';
}

const INITIAL_SUGGESTIONS: Record<string, string[]> = {
  citizen: [
    "How do I track my complaint?",
    "What are the standard resolution SLAs?",
    "Which department handles road potholes?",
    "How does CivicProof community verification work?"
  ],
  officer: [
    "How do I submit after-repair photographic proof?",
    "What triggers an SLA breach alert?",
    "How are priority scores calculated?",
    "What is required in a field inspection note?"
  ],
  admin: [
    "What is the citywide resolution rate?",
    "Which wards have chronic breakdown clusters?",
    "How do I export non-PII audit reports?",
    "What is the CivicPulse predictive methodology?"
  ]
};

export const CivicAiAssistant: React.FC<CivicAiAssistantProps> = ({ currentRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'citizen' | 'officer' | 'commissioner'>(
    currentRole === 'admin' ? 'commissioner' : currentRole
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: "Welcome to CivicResolve Official Municipal Intelligence. I provide authoritative guidance on complaint filing, department routing, resolution SLAs, and GIS verification in Coimbatore. How can I assist you?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_questions: INITIAL_SUGGESTIONS[currentRole === 'admin' ? 'commissioner' : currentRole]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roleKey = currentRole === 'admin' ? 'commissioner' : currentRole;
    setActiveRole(roleKey);
  }, [currentRole]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await CivicApi.chatWithAssistant(query.trim(), activeRole);
      const assistantMsg: AIChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_questions: response.suggested_questions
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "Municipal service connection unavailable. Please verify connectivity or retry in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: `Session reset. Operating in ${activeRole.toUpperCase()} mode. Ask any question regarding Coimbatore municipal operations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_questions: INITIAL_SUGGESTIONS[activeRole]
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-xl hover:shadow-2xl transition duration-200 flex items-center gap-2.5 group"
          title="Open Civic AI Municipal Assistant"
        >
          <div className="relative">
            <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline">
            Civic AI Assistant
          </span>
        </button>
      )}

      {/* Expandable Right Side Panel Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col font-sans animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 bg-[#1E293B] text-white border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                  <span>Civic AI Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-mono font-medium">
                    v2.5
                  </span>
                </h3>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Coimbatore Municipal Intelligence
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Mode Pills Switcher */}
          <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-500 text-[10px] uppercase font-bold pl-1">Role:</span>
            <div className="flex items-center gap-1">
              {(['citizen', 'officer', 'commissioner'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    handleClearHistory();
                  }}
                  className={`px-2.5 py-1 rounded-md capitalize transition ${
                    activeRole === r 
                      ? 'bg-blue-600 text-white shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp}
                </span>

                {/* Suggested Question Chips */}
                {m.suggested_questions && m.suggested_questions.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {m.suggested_questions.map((sq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sq)}
                          className="text-left text-[11px] p-2 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 transition flex items-center justify-between shadow-2xs group"
                        >
                          <span>{sq}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-xs text-slate-500 shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Formulating municipal response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${activeRole} question (no emojis)...`}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition shadow-2xs"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Powered by Google Gemini 2.5 Flash • Zero Emojis • WCAG 2.1 AA
            </p>
          </div>
        </div>
      )}
    </>
  );
};
