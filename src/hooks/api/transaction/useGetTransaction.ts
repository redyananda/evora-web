import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export interface Transaction {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  status: string;
  totalPrice: number;
  finalPrice: number;
  paymentProof: string | null;
  paymentDeadline: string;
  confirmationDeadline: string | null;
  paidAt: string | null;
  createdAt: string;
  event: {
    eventName: string;
    slug: string;
    venue: string;
    location: string;
    startDate: string;
    price: number;
    thumbnail: string | null;
  };
}

interface GetTransactionResponse {
  data: Transaction;
}

const useGetTransaction = (id: number | null) => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["transaction", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetTransactionResponse>(
        `/transactions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data.data;
    },
  });
};

export default useGetTransaction;
