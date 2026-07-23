import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import type { CustomerTransaction } from "@/types/customer";

interface CustomerTransactionsResponse {
  data: CustomerTransaction[];
}

const useCustomerTransactions = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["customer-transactions"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<CustomerTransactionsResponse>("/transactions");
      return data.data;
    },
  });
};

export default useCustomerTransactions;

