import { useState } from "react";
import { Search, MessageCircle, Phone, Video, MoreHorizontal, Send, Sun, Moon, MapPin, Heart } from "lucide-react";
import { MobileHeader } from "./MobileHeader";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface MessagesScreenProps {
  isDark: boolean;
  onThemeToggle: () => void;
  conversations: Conversation[];
  onShowMatches: () => void;
  matchesCount: number;
  onConversationSelect?: (conversationId: string) => void;
  onViewUserProfile?: (userId: string) => void;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  property: string;
  matchId?: string;
}

export function MessagesScreen({ isDark, onThemeToggle, conversations, onShowMatches, matchesCount, onConversationSelect, onViewUserProfile }: MessagesScreenProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(
                "text-2xl font-semibold font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {isDark ? (
                  <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta bg-clip-text text-transparent">
                    Messages
                  </span>
                ) : (
                  "Messages"
                )}
              </h1>
              <p className={cn(
                "text-sm mt-1 font-poppins",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {conversations.filter(c => c.unread > 0).length} nouveau(x) message(s)
              </p>
            </div>
            <div className="flex items-center space-x-3">
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

          {/* Search Bar */}
          <div className="relative">
            <div className={cn(
              "flex items-center p-3 rounded-xl border transition-all duration-300",
              isDark 
                ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                : "bg-white border-gray-300 hover:border-gray-400 shadow-sm"
            )}>
              <Search className={cn(
                "w-5 h-5 mr-3",
                isDark ? "text-gray-400" : "text-gray-500"
              )} />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Rechercher une conversation..."
                className={cn(
                  "flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none font-poppins",
                  isDark 
                    ? "text-white placeholder:text-gray-400" 
                    : "text-gray-900 placeholder:text-gray-500"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="p-4 space-y-3">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            onClick={() => onConversationSelect ? onConversationSelect(conversation.id) : setSelectedChat(conversation.id)}
            className={cn(
              "p-4 cursor-pointer transition-all duration-300 hover-lift",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl hover:border-purple-500/50" 
                : "bg-white border border-gray-200 hover:shadow-md"
            )}
          >
            <div className="flex items-center space-x-4">
              {/* Avatar with online status */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Map conversation name to userId - in real app this would be stored in conversation object
                    const userId = conversation.name === "Marie Dubois" ? "user-1" : "user-2";
                    onViewUserProfile?.(userId);
                  }}
                  className="block hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                  {conversation.matchId && (
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </button>
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const userId = conversation.name === "Marie Dubois" ? "user-1" : "user-2";
                      onViewUserProfile?.(userId);
                    }}
                    className="text-left hover:underline"
                  >
                    <h3 className={cn(
                      "font-semibold truncate font-poppins",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {conversation.name}
                      {conversation.matchId && (
                        <Badge className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white">
                          Nouveau match !
                        </Badge>
                      )}
                    </h3>
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      {conversation.timestamp}
                    </span>
                    {conversation.unread > 0 && (
                      <Badge className={cn(
                        "px-2 py-0.5 min-w-[20px] h-5 rounded-full text-xs font-bold",
                        isDark 
                          ? "bg-neon-magenta text-white" 
                          : "bg-red-500 text-white"
                      )}>
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className={cn(
                    "text-sm truncate font-poppins",
                    conversation.unread > 0
                      ? isDark ? "text-white font-medium" : "text-gray-900 font-medium"
                      : isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center space-x-1">
                    <MapPin className={cn(
                      "w-3 h-3",
                      isDark ? "text-neon-cyan" : "text-blue-600"
                    )} />
                    <p className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-neon-cyan" : "text-blue-600"
                    )}>
                      {conversation.property}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}>
                  <Phone className="w-4 h-4" />
                </button>
                <button className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}>
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State or Quick Actions */}
      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <MessageCircle className={cn(
            "w-16 h-16 mb-4",
            isDark ? "text-gray-600" : "text-gray-400"
          )} />
          <h3 className={cn(
            "text-xl font-semibold mb-2 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Aucune conversation
          </h3>
          <p className={cn(
            "text-center max-w-md font-poppins",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Vos conversations avec les propriétaires apparaîtront ici. Commencez par explorer les logements !
          </p>
          <button
            onClick={onShowMatches}
            className={cn(
              "mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
              isDark
                ? "bg-gradient-to-r from-neon-purple to-neon-magenta text-white hover:from-neon-magenta hover:to-neon-purple"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            )}
          >
            Trouver des matchs
          </button>
        </div>
      )}
    </div>
  );
}