import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/store/auth.store";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success(data.message ?? "Login berhasil!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login gagal. Periksa email dan password Anda.";
      toast.error(message);
    },
  });
};
