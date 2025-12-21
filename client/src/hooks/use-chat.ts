import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
import { api, type ReportInput } from "@shared/routes"; // Import backend routes if needed for validation

// Since the chat integration uses its own routes structure in replit_integrations/chat/routes.ts
// We'll build custom fetch logic here matching that structure.

interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: number;
  title: string;
}

export function useChat() {
  const queryClient = useQueryClient();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  // Fetch all conversations
  const conversationsQuery = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return await res.json() as Conversation[];
    },
  });

  // Create new conversation
  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(data.id);
    },
  });

  // Fetch messages for current conversation
  const messagesQuery = useQuery({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    queryFn: async () => {
      if (!currentConversationId) return [];
      const res = await fetch(`/api/conversations/${currentConversationId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return data.messages as Message[];
    },
    enabled: !!currentConversationId,
  });

  // Send message with streaming
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversationId) {
      // Create conversation first if none exists
      // This logic should ideally be handled by creating a convo first then sending
      // For simplicity in this hook, we assume a convo exists or is created before calling this
      return; 
    }

    setIsStreaming(true);
    setStreamedContent("");
    
    // Optimistically update UI would happen in the component
    
    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch(`/api/conversations/${currentConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setStreamedContent(prev => prev + data.content);
              }
              if (data.done) {
                // Done streaming
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream error", err);
    } finally {
      setIsStreaming(false);
      setStreamedContent("");
      // Refresh full message history
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", currentConversationId, "messages"] });
    }
  }, [currentConversationId, queryClient]);

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  return {
    conversations: conversationsQuery.data || [],
    isLoadingConversations: conversationsQuery.isLoading,
    messages: messagesQuery.data || [],
    isLoadingMessages: messagesQuery.isLoading,
    currentConversationId,
    setCurrentConversationId,
    createConversation: createConversation.mutateAsync,
    sendMessage,
    isStreaming,
    streamedContent,
    stopGeneration
  };
}
