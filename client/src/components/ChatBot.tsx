import { useState, useRef, useEffect } from 'react';
import { Bot, X, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm the BFGI Campus AI. How can I help you navigate or learn about our college today?",
  sender: 'ai',
  timestamp: new Date(),
};

export const ChatBot = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
    } else {
      setTimeout(() => {
        setMessages([INITIAL_MESSAGE]);
        setIsTyping(false);
      }, 300);
    }
  }, [messages, isTyping, isVisible]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      let answer = "I'm sorry, I don't have information about that yet.";
      const query = text.toLowerCase();

      if (query.includes('bfgi')) {
        answer = "Baba Farid Group of Institutions (BFGI), established in 1993/1994 in Bathinda, Punjab, is a premier private educational hub accredited with an 'A+' grade by NAAC. It offers diverse UG, PG, and doctoral programs in Engineering, Management, Law, and Education. Known for its lush green, Wi-Fi-enabled campus, it boasts strong placements, international collaborations, and top rankings in the region.";
      } else if (query.includes('chairman')) {
        answer = "Dr. Gurmeet Singh Dhaliwal is the Chairman of the Baba Farid Group of Institutions (BFGI). As a prominent educationist and Bharat Jyoti Awardee, he has led the institution since its inception in 1993, expanding it into a major education hub in Punjab known for its industry-academia linkages.";
      } else if (query.includes('director')) {
        answer = "Prof. (Dr.) M.P. Poonia is the Campus Director of Baba Farid Group of Institutions (BFGI), bringing over 37 years of experience in technical education and institutional development. The former Vice Chairman of AICTE, New Delhi, he focuses on fostering academic excellence, innovation, and industry immersion across BFGI’s engineering, management, and scientific programs.";
      } else if (query.includes('facilities')) {
        answer = "Baba Farid Group of Institutions (BFGI) in Bathinda offers a fully Wi-Fi-enabled, eco-friendly campus with modern amenities, including AC smart classrooms, well-equipped labs (including an Intel AI lab), a massive library, and 24/7 security. The campus features separate AC hostels, a multipurpose gymnasium, extensive sports facilities, a hygienic canteen, and a fleet of over 125 buses for transportation.";
      } else if (query.includes('admission')) {
        answer = "Our admission process is extremely student-friendly! You can visit the Admission Cell on campus. We also offer fantastic merit-based scholarships up to 100% tuition fee waivers!";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-30 right-26 w-130 h-[650px] max-h-[70vh] z-[100] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-[#002b5c] to-[#004080] p-4 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
              <Bot className="text-white" size={20} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#002b5c] rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-wide flex items-center gap-1">
              Campus AI <Sparkles size={12} className="text-blue-300" />
            </h3>
            <p className="text-blue-200 text-[11px] font-medium tracking-wide">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors active:scale-95"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 space-y-5 custom-scrollbar">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} gap-3`}>
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 mt-auto shadow-sm">
                  <Bot size={16} className="text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm ${
                  isAI
                    ? 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                    : 'bg-[#002b5c] text-white rounded-br-sm shadow-blue-900/20'
                }`}
              >
                {msg.text}
              </div>
              {!isAI && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300 mt-auto shadow-sm">
                  <User size={16} className="text-slate-500" />
                </div>
              )}
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 mt-auto">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-white border border-slate-200 py-4 px-5 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <p className="text-xs font-bold text-slate-400 mb-3 ml-1 uppercase tracking-wider">Suggested Questions</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Tell me about BFGI",
            "Tell me about Campus Chairman",
            "Tell me about Campus Director",
            "Campus Facilities",
            "Admission Process"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              disabled={isTyping}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-[13px] font-bold rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};
