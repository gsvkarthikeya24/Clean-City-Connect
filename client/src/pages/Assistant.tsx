import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Plus, Loader2, StopCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Assistant() {
  const { 
    conversations, 
    messages, 
    currentConversationId, 
    setCurrentConversationId, 
    createConversation, 
    sendMessage,
    isStreaming,
    streamedContent,
    stopGeneration
  } = useChat();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent]);

  // Create initial conversation if none exists
  useEffect(() => {
    if (conversations.length === 0 && !currentConversationId) {
      createConversation("New Chat").catch(console.error);
    } else if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId, createConversation, setCurrentConversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    const content = input;
    setInput("");
    await sendMessage(content);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] pb-20 md:pb-0 bg-background">
      {/* Sidebar - Desktop only for now */}
      <div className="hidden md:flex w-64 border-r border-border flex-col bg-muted/10">
        <div className="p-4 border-b border-border">
          <Button 
            onClick={() => createConversation("New Chat")} 
            className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-foreground border-none"
            variant="outline"
          >
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentConversationId(chat.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate",
                  currentConversationId === chat.id 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-background/50 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold">City Assistant</h2>
              <p className="text-[10px] text-muted-foreground">AI-Powered Support</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
               <Bot className="w-16 h-16 text-muted-foreground mb-4" />
               <h3 className="font-semibold text-lg">How can I help you today?</h3>
               <p className="text-sm max-w-xs mt-2">Ask me about waste segregation, reporting issues, or city services.</p>
               
               <div className="grid grid-cols-1 gap-2 mt-8 w-full max-w-md">
                 {["How do I recycle batteries?", "Report a broken streetlight", "What goes in the blue bin?"].map((q) => (
                   <Button key={q} variant="outline" className="text-xs h-auto py-2" onClick={() => { setInput(q); }}>
                     "{q}"
                   </Button>
                 ))}
               </div>
             </div>
          )}
          
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <Avatar className={cn("w-8 h-8 mt-1", msg.role === "user" ? "bg-blue-100" : "bg-primary/10")}>
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </Avatar>
              
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20" 
                  : "bg-muted rounded-tl-none border border-border/50"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Streaming Message */}
          {isStreaming && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <Avatar className="w-8 h-8 mt-1 bg-primary/10">
                <Bot className="w-4 h-4 text-primary" />
              </Avatar>
              <div className="p-3 rounded-2xl text-sm leading-relaxed bg-muted rounded-tl-none border border-border/50">
                {streamedContent}
                <span className="inline-block w-1.5 h-3 ml-1 bg-primary align-middle animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="pr-12 rounded-full border-border bg-muted/30 focus:bg-background transition-colors h-11"
              disabled={isStreaming}
            />
            {isStreaming ? (
              <Button 
                type="button" 
                size="icon" 
                onClick={stopGeneration}
                variant="destructive"
                className="absolute right-1 rounded-full w-9 h-9"
              >
                <StopCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim()}
                className="absolute right-1 rounded-full w-9 h-9 bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
