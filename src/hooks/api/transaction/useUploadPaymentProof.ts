import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface UploadPaymentProofPayload {
  transactionId: number;
  proof: File;
}

interface UploadPaymentProofResponse {
  message: string;
  data: { id: number; status: string; paymentProof: string | null };
}

export const useUploadPaymentProof = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, proof }: UploadPaymentProofPayload) => {
      const formData = new FormData();
      formData.append("paymentProof", proof);

      const { data } = await axiosInstance.patch<UploadPaymentProofResponse>(
        `/transactions/${transactionId}/payment-proof`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    },
    onSuccess: (data, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] });
      toast.success(data.message ?? "Bukti pembayaran berhasil diunggah!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal mengunggah bukti pembayaran. Silakan coba lagi.";
      toast.error(message);
    },
  });
};
