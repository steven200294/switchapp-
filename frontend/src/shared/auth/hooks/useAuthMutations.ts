import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useAuthStore } from "@/shared/stores/auth.store";
import {
  loginUser,
  registerUser,
  sendEmailVerification,
  sendPhoneOtp,
  verifyPhoneOtp,
  updatePreferences,
  updateProfile,
  getMyProfile,
} from "../services/auth.service";

export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME });
    },
  });
}

export function useRegisterMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string; full_name: string; captcha_token: string }) =>
      registerUser(data),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME });
    },
  });
}

export function useSendEmailVerificationMutation() {
  return useMutation({
    mutationFn: (email: string) => sendEmailVerification(email),
  });
}

export function useSendPhoneOtpMutation() {
  return useMutation({
    mutationFn: ({ phone, countryCode }: { phone: string; countryCode: string }) =>
      sendPhoneOtp(phone, countryCode),
  });
}

export function useVerifyPhoneOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      verifyPhoneOtp(phone, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME });
    },
  });
}

export function useMyProfile(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.MY_PROFILE,
    queryFn: getMyProfile,
    enabled,
    staleTime: 60_000,
  });
}

export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES_FEED });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROFILE });
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROFILE });
    },
  });
}
