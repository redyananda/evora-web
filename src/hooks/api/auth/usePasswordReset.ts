import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

interface ForgotPasswordResponse {
  message: string;
  data?: { resetToken?: string };
}

export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axiosInstance.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        { email }
      );
      return data;
    },
    onSuccess: ({ message }) => toast.success(message),
    onError: (error) => toast.error(errorMessage(error, "Permintaan reset gagal")),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: async (payload: { token: string; newPassword: string }) => {
      const { data } = await axiosInstance.post<{ message: string }>(
        "/auth/reset-password",
        payload
      );
      return data;
    },
    onSuccess: ({ message }) => toast.success(message),
    onError: (error) => toast.error(errorMessage(error, "Password gagal direset")),
  });

