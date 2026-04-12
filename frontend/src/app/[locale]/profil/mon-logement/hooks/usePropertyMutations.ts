"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { publishProperty, saveDraftProperty } from "../services/listing.service";
import { publishPropertyById, unpublishPropertyById, deletePropertyById, updateProperty } from "../../services/property.service";
import type { ChatData } from "@/shared/ui/chatbot";

const DRAFT_KEY = "switchapp_listing_draft";

function clearDraftStorage() {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(`${DRAFT_KEY}_details`);
}

export function usePublishFromChat(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChatData) => publishProperty(data),
    onSuccess: () => {
      clearDraftStorage();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROPERTY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES });
      onSuccess();
    },
  });
}

export function useSaveDraft(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChatData) => saveDraftProperty(data),
    onSuccess: () => {
      clearDraftStorage();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROPERTY });
      onSuccess();
    },
  });
}

export function usePublishById(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishPropertyById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROPERTY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES });
      onSuccess();
    },
  });
}

export function useUnpublish(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unpublishPropertyById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROPERTY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES });
      onSuccess();
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROPERTY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES });
    },
  });
}

export function useDeleteProperty(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePropertyById(id),
    onSuccess: () => {
      clearDraftStorage();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROPERTY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES });
      onSuccess();
    },
  });
}
