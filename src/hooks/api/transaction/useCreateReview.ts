import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface CreateReviewPayload {
  transactionId: number;
  rating: number;
  comment?: string;
}

interface CreateReviewResponse {
  message: string;
  data: {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
  };
}

export const useCreateReview = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      rating,
      comment,
    }: CreateReviewPayload) => {
      const { data } = await axiosInstance.post<CreateReviewResponse>(
        `/transactions/${transactionId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer-transactions"] });
      toast.success(data.message ?? "Ulasan berhasil dikirim!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal mengirim ulasan. Silakan coba lagi.";
      toast.error(message);
    },
  });
};
