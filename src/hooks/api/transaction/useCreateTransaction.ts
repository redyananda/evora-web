import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export interface CreateTransactionPayload {
  eventId: number;
  quantity: number;
  voucherCode?: string;
  couponCode?: string;
  pointsToUse?: number;
}

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
    voucherDiscount: number;
    couponDiscount: number;
    discount: number;
    taxableAmount: number;
    tax: number;
    bill: number;
    pointsUsed: number;
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
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create order. Please try again.";
      toast.error(message);
    },
  });
};
