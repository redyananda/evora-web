import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import type { Event } from "@/types/event";

export interface CreateEventPayload {
  eventName: string;
  description: string;
  category: string;
  price: number;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  thumbnail: File;
}

interface CreateEventResponse {
  message: string;
  data: Event;
}

export const useCreateEvent = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      // The endpoint takes multipart/form-data because the thumbnail is a file.
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value instanceof File ? value : String(value));
      });

      const { data } = await axiosInstance.post<CreateEventResponse>(
        "/events",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(data.message ?? "Event berhasil dibuat!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal membuat event. Silakan coba lagi.";
      toast.error(message);
    },
  });
};
