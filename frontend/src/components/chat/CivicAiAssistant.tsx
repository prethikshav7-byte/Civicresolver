import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, X, Send, Loader2, 
  RotateCcw, ChevronRight, MessageSquare 
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { AIChatMessage } from '../../types';
import { useTranslation } from '../../i18n/translations';

interface CivicAiAssistantProps {
  currentRole: 'citizen' | 'officer' | 'admin';
}

const INITIAL_SUGGESTIONS: Record<string, Record<string, string[]>> = {
  en: {
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
    commissioner: [
      "What is the citywide resolution rate?",
      "Which wards have chronic breakdown clusters?",
      "How do I export non-PII audit reports?",
      "What is the CivicPulse predictive methodology?"
    ]
  },
  ta: {
    citizen: [
      "என் புகாரை எவ்வாறு கண்காணிப்பது?",
      "தீர்வு காணும் காலக்கெடு என்ன?",
      "சாலைக் குழிகளை எந்தத் துறை சரிசெய்கிறது?",
      "பணிச் சான்று எவ்வாறு செயல்படுகிறது?"
    ],
    officer: [
      "பழுதுபார்த்த புகைப்பட ஆதாரத்தை எவ்வாறு பதிவேற்றுவது?",
      "காலக்கெடு மீறல் எச்சரிக்கை எப்போது வரும்?",
      "முன்னுரிமை மதிப்பீடு எவ்வாறு கணக்கிடப்படுகிறது?",
      "கள ஆய்வு குறிப்பில் என்ன எழுத வேண்டும்?"
    ],
    commissioner: [
      "நகர அளவிலான தீர்வு விகிதம் என்ன?",
      "எந்த வார்டுகளில் அதிக புகார்கள் உள்ளன?",
      "சிஎஸ்வி தணிக்கை அறிக்கையை எவ்வாறு எடுப்பது?",
      "முன்னறிவிப்பு ரேடார் எவ்வாறு கணக்கிடுகிறது?"
    ]
  },
  hi: {
    citizen: [
      "मैं अपनी शिकायत कैसे ट्रैक करूँ?",
      "समाधान की समय सीमा क्या है?",
      "सड़क के गड्ढों को कौन सा विभाग संभालता है?",
      "कार्य प्रमाण सत्यापन कैसे काम करता है?"
    ],
    officer: [
      "मरम्मत के बाद का फोटो प्रमाण कैसे अपलोड करें?",
      "समय सीमा उल्लंघन चेतावनी कब मिलती है?",
      "प्राथमिकता अंक की गणना कैसे की जाती है?",
      "फील्ड निरीक्षण नोट में क्या आवश्यक है?"
    ],
    commissioner: [
      "पूरे शहर की समाधान दर क्या है?",
      "किन वार्डों में सबसे अधिक समस्याएं हैं?",
      "ऑडिट रिपोर्ट कैसे डाउनलोड करें?",
      "पूर्वानुमान रडार कैसे कार्य करता है?"
    ]
  }
};

export const CivicAiAssistant: React.FC<CivicAiAssistantProps> = ({ currentRole }) => {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'citizen' | 'officer' | 'commissioner'>(
    currentRole === 'admin' ? 'commissioner' : currentRole
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentLang = language in INITIAL_SUGGESTIONS ? language : 'en';

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: language === 'ta'
        ? "CivicResolver நகராட்சி பொது நுண்ணறிவு உதவிக்கு வரவேற்கிறோம். கோயம்புத்தூர் மாநகராட்சி தொடர்பான கேள்விகளை நீங்கள் கேட்கலாம்."
        : language === 'hi'
          ? "CivicResolver नगर पालिका सहायता में आपका स्वागत है। आप कोयंबटूर नगर निगम संबंधी कोई भी प्रश्न पूछ सकते हैं।"
          : "Welcome to CivicResolver Official Municipal Intelligence. Authoritative guidance on complaints, department routing, SLAs, and GIS verification in Coimbatore.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_questions: INITIAL_SUGGESTIONS[currentLang][currentRole === 'admin' ? 'commissioner' : currentRole]
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
        text: "Municipal service connection unavailable. Please retry in a moment.",
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
        text: `Session reset. Operating in ${activeRole.toUpperCase()} mode.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_questions: INITIAL_SUGGESTIONS[currentLang][activeRole]
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button with emerald green theme matching Image 4 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#167A4D] hover:bg-[#12603C] text-white rounded-full p-3.5 shadow-xl hover:shadow-2xl transition duration-200 flex items-center gap-2.5 group"
          title="Open Civic AI Assistant"
        >
          <div className="relative">
            <Compass className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-[#167A4D]" />
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline">
            {t.chatTitle}
          </span>
        </button>
      )}

      {/* Expandable Right Side Panel Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col font-sans animate-slideLeft">
          
          {/* Header with #12382C dark municipal green */}
          <div className="p-4 bg-[#12382C] text-white border-b border-emerald-950 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#167A4D] flex items-center justify-center text-white shadow-2xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                  <span>{t.chatTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                    Coimbatore
                  </span>
                </h3>
                <span className="text-[10px] text-emerald-200/80 block mt-0.5">
                  {t.chatSubtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/50 transition"
                title={t.chatReset}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/50 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Mode Switcher */}
          <div className="bg-[#E8F4EC] p-2 border-b border-emerald-100 flex items-center justify-between text-[11px] font-semibold">
            <span className="text-emerald-900 text-[10px] uppercase font-bold pl-1">Role:</span>
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
                      ? 'bg-[#167A4D] text-white shadow-2xs font-bold' 
                      : 'text-emerald-900 hover:text-emerald-950 hover:bg-white/80'
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
                      ? 'bg-[#167A4D] text-white rounded-br-xs'
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
                      Quick Inquiries:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {m.suggested_questions.map((sq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sq)}
                          className="text-left text-[11px] p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-[#167A4D] transition flex items-center justify-between shadow-2xs group"
                        >
                          <span>{sq}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#167A4D] shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-xs text-slate-500 shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#167A4D]" />
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
                placeholder={t.chatPlaceholder}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A4D] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-[#167A4D] hover:bg-[#12603C] text-white rounded-xl disabled:opacity-50 transition shadow-2xs"
                title={t.chatSend}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              CivicResolver Intelligence • Zero Emojis • Coimbatore
            </p>
          </div>
        </div>
      )}
    </>
  );
};
