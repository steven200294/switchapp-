import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listConversations, getMessages, sendMessage } from "../services/messages.service";

export function useConversations(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS,
    queryFn: listConversations,
    enabled,
  });
}

export function useMessages(conversationId: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.MESSAGES(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: enabled && !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES(conversationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS });
    },
  });
}
