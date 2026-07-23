import { axiosInstance } from "@/lib/axios";
import type { OrganizerProfile } from "@/types/organizer";
import { useQuery } from "@tanstack/react-query";

const useGetOrganizerProfile = (id: string) =>
  useQuery({
    queryKey: ["organizer-profile", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: OrganizerProfile }>(
        `/organizers/${id}`
      );
      return data.data;
    },
  });

export default useGetOrganizerProfile;
