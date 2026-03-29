"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminConversations, getConversationMessages, type AdminConversation, type AdminMessage } from "@/shared/services/admin.service";
import DataTable from "@/app/components/DataTable";

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_CONVERSATIONS, page],
    queryFn: () => getAdminConversations(page),
  });

  const { data: msgData, isLoading: msgLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_CONVERSATION_MESSAGES(selectedId ?? ""),
    queryFn: () => getConversationMessages(selectedId!),
    enabled: !!selectedId,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Messages <span className="text-gray-400 font-normal text-lg">({data?.total ?? 0} conversations)</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DataTable<AdminConversation>
            columns={[
              {
                key: "participants",
                header: "Participants",
                render: (c) => <span className="font-medium text-gray-900">{c.participant_names ?? "—"}</span>,
              },
              {
                key: "messages",
                header: "Msgs",
                render: (c) => <span className="text-xs font-semibold text-gray-600">{c.message_count}</span>,
              },
              {
                key: "last",
                header: "Last Message",
                render: (c) => (
                  <div className="max-w-[200px]">
                    <p className="text-xs text-gray-500 truncate">{c.last_message_text ?? "—"}</p>
                    <p className="text-[10px] text-gray-400">
                      {c.last_message_at ? new Date(c.last_message_at).toLocaleString("fr-FR") : "—"}
                    </p>
                  </div>
                ),
              },
            ]}
            data={data?.conversations ?? []}
            keyExtractor={(c) => c.id}
            onRowClick={(c) => setSelectedId(c.id)}
            isLoading={isLoading}
            emptyMessage="No conversations."
            total={data?.total}
            page={page}
            onPageChange={setPage}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              {selectedId ? "Conversation" : "Select a conversation"}
            </h3>
          </div>
          <div className="p-4 max-h-[600px] overflow-y-auto space-y-3">
            {!selectedId && <p className="text-sm text-gray-400 text-center py-8">Click a conversation to view messages</p>}
            {selectedId && msgLoading && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            )}
            {selectedId && msgData?.messages.map((msg: AdminMessage) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-gray-400">{(msg.sender_name ?? "?")[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-xs font-semibold text-gray-900">{msg.sender_name ?? msg.sender_id.slice(0, 8)}</p>
                    <p className="text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleString("fr-FR")}</p>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{msg.content ?? "—"}</p>
                </div>
              </div>
            ))}
            {selectedId && msgData && msgData.messages.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No messages in this conversation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
