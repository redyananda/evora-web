import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import type { Profile, UpdateProfilePayload } from "@/types/profile";

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: Profile }>("/profile");
      return data.data;
    },
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await axiosInstance.patch<{ message: string; data: Profile }>(
        "/profile",
        payload
      );
      return data;
    },
    onSuccess: ({ data, message }) => {
      updateUser({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        userRole: data.userRole,
        referralCode: data.referralCode,
        profilePicture: data.profilePicture,
        userPoint: data.userPoint,
        phoneNumber: data.phoneNumber,
        address: data.address,
      });
      queryClient.setQueryData(["profile"], data);
      toast.success(message);
    },
    onError: (error) => toast.error(errorMessage(error, "Profil gagal diperbarui")),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/profile/password",
        payload
      );
      return data;
    },
    onSuccess: ({ message }) => toast.success(message),
    onError: (error) => toast.error(errorMessage(error, "Password gagal diubah")),
  });
