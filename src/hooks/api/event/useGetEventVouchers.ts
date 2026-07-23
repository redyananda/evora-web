import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface EventVoucher {
  id: number;
  code: string;
  discount: number;
  availableVoucher: number;
  endDate: string;
}

const useGetEventVouchers = (slug: string) =>
  useQuery({
    queryKey: ["event-vouchers", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: EventVoucher[] }>(
        `/events/${slug}/vouchers`
      );
      return data.data;
    },
  });

export default useGetEventVouchers;
