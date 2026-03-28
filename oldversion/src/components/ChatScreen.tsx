import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Phone, Video, MoreHorizontal, Smile, Paperclip, Camera, Sun, Moon, Heart } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface ChatScreenProps {
  conversationId: string;
  conversation: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
    property: string;
    matchId?: string;
  };
  isDark: boolean;
  onBack: () => void;
  onThemeToggle: () => void;
  onShowMatches: () => void;
  matchesCount: number;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const sampleMessages: Message[] = [
  {
    id: '1',
    text: 'Salut ! J\'ai vu votre annonce pour l\'échange d\'appartement. Je suis très intéressée !',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    isOwn: false,
    status: 'read'
  },
  {
    id: '2', 
    text: 'Bonjour ! Merci pour votre intérêt. Votre appartement à Lyon m\'intéresse beaucoup également 😊',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 1h55 ago
    isOwn: true,
    status: 'read'
  },
  {
    id: '3',
    text: 'Parfait ! Pouvez-vous me donner plus de détails sur le quartier ? Et les commodités à proximité ?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h ago
    isOwn: false,
    status: 'read'
  },
  {
    id: '4',
    text: 'Bien sûr ! L\'appartement est dans le 7ème arrondissement, très proche du métro Invalides. Il y a plein de restaurants et commerces à 2 minutes à pied.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 10 * 60 * 1000), // 50min ago
    isOwn: true,
    status: 'read'
  },
  {
    id: '5',
    text: 'Il y a aussi une boulangerie excellente juste en bas de l\'immeuble et un petit marché le mercredi 🥖',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 11 * 60 * 1000), // 49min ago
    isOwn: true,
    status: 'read'
  },
  {
    id: '6',
    text: 'Ça a l\'air parfait ! Et côté transport, c\'est pratique pour aller au centre ?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30min ago
    isOwn: false,
    status: 'read'
  },
  {
    id: '7',
    text: 'Oui, très pratique ! Métro ligne 8 et 13, plus le RER C. En 15min vous êtes à Châtelet ou à Saint-Michel.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25min ago
    isOwn: true,
    status: 'read'
  },
  {
    id: '8',
    text: 'Super ! Je suis disponible pour échanger en mars. Ça vous intéresse toujours ?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5min ago
    isOwn: false,
    status: 'delivered'
  }
];

export function ChatScreen({ conversationId, conversation, isDark, onBack, onThemeToggle, onShowMatches, matchesCount }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isOwn: true,
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getDate() - date.getDate();
    
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h1 className={cn(
                    "font-semibold font-poppins",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {conversation.name}
                  </h1>
                  <p className={cn(
                    "text-xs font-poppins",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {conversation.online ? "En ligne" : "Hors ligne"} • {conversation.property}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Phone className="w-5 h-5" />
              </button>
              
              <button
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Video className="w-5 h-5" />
              </button>

              {/* Matches Button */}
              <button
                onClick={onShowMatches}
                className={cn(
                  "relative p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gradient-to-r from-neon-purple/30 to-neon-magenta/30 text-neon-magenta hover:from-neon-magenta/40 hover:to-neon-purple/40" 
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                )}
              >
                <Heart className="w-5 h-5" />
                {matchesCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {matchesCount > 9 ? '9+' : matchesCount}
                  </div>
                )}
              </button>
              
              <button 
                onClick={onThemeToggle}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
          
          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium font-poppins",
                    isDark 
                      ? "bg-gray-800 text-gray-400" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={cn(
                "flex",
                message.isOwn ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                  message.isOwn
                    ? (isDark 
                        ? "bg-gradient-to-r from-neon-blue to-neon-cyan text-black"
                        : "bg-blue-500 text-white")
                    : (isDark 
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900 border border-gray-200")
                )}>
                  <p className="text-sm font-poppins">{message.text}</p>
                  <div className={cn(
                    "flex items-center justify-end space-x-1 mt-1",
                    message.isOwn && (isDark ? "text-black/70" : "text-white/70")
                  )}>
                    <span className="text-xs font-poppins">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isOwn && (
                      <div className="flex space-x-1">
                        {message.status === 'sending' && (
                          <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                        )}
                        {message.status === 'sent' && (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                        {(message.status === 'delivered' || message.status === 'read') && (
                          <div className="flex space-x-0.5">
                            <div className="w-2 h-2 rounded-full bg-current" />
                            <div className="w-2 h-2 rounded-full bg-current" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-6 h-6 rounded-full"
            />
            <div className={cn(
              "px-3 py-2 rounded-full flex items-center space-x-1",
              isDark ? "bg-gray-800" : "bg-gray-200"
            )}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className={cn(
        "sticky bottom-0 border-t backdrop-blur-xl",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4">
          <div className={cn(
            "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300",
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-300"
          )}>
            <button
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                isDark 
                  ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tapez votre message..."
              className={cn(
                "flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none font-poppins",
                isDark 
                  ? "text-white placeholder:text-gray-400" 
                  : "text-gray-900 placeholder:text-gray-500"
              )}
            />
            
            <button
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                isDark 
                  ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                isDark 
                  ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <Camera className="w-5 h-5" />
            </button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={cn(
                "p-2 rounded-full transition-all duration-300 disabled:opacity-50",
                isDark
                  ? "bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:from-neon-cyan hover:to-neon-blue"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}