import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export interface CreateTransactionPayload {
  eventId: number;
  quantity: number;
  voucherCode?: string;
}

// The server recomputes the price, so it also sends back the breakdown it used.
export interface TransactionResult {
  id: number;
  eventId: number;
  quantity: number;
  totalPrice: number;
  finalPrice: number;
  status: string;
  paymentDeadline: string;
  breakdown: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  };
}

interface CreateTransactionResponse {
  message: string;
  data: TransactionResult;
}

export const useCreateTransaction = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const { data } = await axiosInstance.post<CreateTransactionResponse>(
        "/transactions",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    },
    onSuccess: () => {
      // Seats went down, so any cached event data is now stale.
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal membuat pesanan. Silakan coba lagi.";
      toast.error(message);
    },
  });
};
