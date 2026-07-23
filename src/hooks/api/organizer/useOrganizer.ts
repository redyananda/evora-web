import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import type {
  EventFormPayload,
  OrganizerDashboardData,
  OrganizerEvent,
  OrganizerVoucher,
  PaginatedOrganizerEvents,
  PaginatedOrganizerTransactions,
  ParticipantData,
  StatisticPeriod,
  TransactionStatus,
  VoucherFormPayload,
} from "@/types/organizer";

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export const useOrganizerDashboard = (period: StatisticPeriod, date: string) =>
  useQuery({
    queryKey: ["organizer-dashboard", period, date],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: OrganizerDashboardData }>(
        "/organizer/dashboard",
        { params: { period, date } }
      );
      return data.data;
    },
  });

export const useOrganizerEvents = (page = 1, search = "", take = 10) =>
  useQuery({
    queryKey: ["organizer-events", page, search, take],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PaginatedOrganizerEvents>(
        "/organizer/events",
        { params: { page, search: search || undefined, take } }
      );
      return data;
    },
  });

export const useUpdateOrganizerEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: EventFormPayload }) => {
      const { data } = await axiosInstance.patch<{ message: string; data: OrganizerEvent }>(
        `/organizer/events/${id}`,
        payload
      );
      return data;
    },
    onSuccess: ({ message }) => {
      void queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      void queryClient.invalidateQueries({ queryKey: ["organizer-dashboard"] });
      toast.success(message);
    },
    onError: (error) => toast.error(errorMessage(error, "Failed to update event")),
  });
};

export const useDeleteOrganizerEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: number) => {
      const { data } = await axiosInstance.delete<{ message: string }>(
        `/organizer/events/${eventId}`
      );
      return data;
    },
    onSuccess: ({ message }) => {
      void queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      void queryClient.invalidateQueries({ queryKey: ["organizer-dashboard"] });
      toast.success(message);
    },
    onError: (error) => toast.error(errorMessage(error, "Failed to delete event")),
  });
};

export const useOrganizerTransactions = (
  page = 1,
  status?: TransactionStatus,
  eventId?: number
) =>
  useQuery({
    queryKey: ["organizer-transactions", page, status, eventId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PaginatedOrganizerTransactions>(
        "/organizer/transactions",
        { params: { page, take: 10, status, eventId } }
      );
      return data;
    },
  });

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      transactionId,
      action,
    }: {
      transactionId: number;
      action: "ACCEPT" | "REJECT";
    }) => {
      const { data } = await axiosInstance.patch<{
        message: string;
        data: { emailDelivered: boolean };
      }>(`/organizer/transactions/${transactionId}/status`, { action });
      return data;
    },
    onSuccess: ({ message, data }) => {
      void queryClient.invalidateQueries({ queryKey: ["organizer-transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["organizer-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["event-participants"] });
      if (data.emailDelivered) toast.success(`${message}. Notification email sent.`);
      else toast.success(`${message}. Configure SMTP to send the notification email.`);
    },
    onError: (error) => toast.error(errorMessage(error, "Failed to process transaction")),
  });
};

export const useOrganizerVouchers = (eventId?: number) =>
  useQuery({
    queryKey: ["organizer-vouchers", eventId ?? "all"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: OrganizerVoucher[] }>(
        "/organizer/vouchers",
        { params: { eventId } }
      );
      return data.data;
    },
  });

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VoucherFormPayload) => {
      const { data } = await axiosInstance.post<{
        message: string;
        data: OrganizerVoucher;
      }>("/organizer/vouchers", payload);
      return data;
    },
    onSuccess: ({ message }) => {
      void queryClient.invalidateQueries({ queryKey: ["organizer-vouchers"] });
      void queryClient.invalidateQueries({ queryKey: ["event-vouchers"] });
      toast.success(message);
    },
    onError: (error) => toast.error(errorMessage(error, "Failed to create voucher")),
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (voucherId: number) => {
      const { data } = await axiosInstance.delete<{ message: string }>(
        `/organizer/vouchers/${voucherId}`
      );
      return data;
    },
    onSuccess: ({ message }) => {
      void queryClient.invalidateQueries({ queryKey: ["organizer-vouchers"] });
      void queryClient.invalidateQueries({ queryKey: ["event-vouchers"] });
      toast.success(message);
    },
    onError: (error) => toast.error(errorMessage(error, "Failed to delete voucher")),
  });
};

export const useEventParticipants = (eventId?: number) =>
  useQuery({
    queryKey: ["event-participants", eventId],
    enabled: Boolean(eventId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: ParticipantData }>(
        `/organizer/events/${eventId}/participants`
      );
      return data.data;
    },
  });
