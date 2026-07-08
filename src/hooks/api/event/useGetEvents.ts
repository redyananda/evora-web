import { axiosInstance } from "@/lib/axios";
import type { Event } from "@/types/event";
import type { PageableResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";


interface GetEventsQuery {
    page: number;
    search?: string;
}


const useGetEvents = ({page, search}: GetEventsQuery) => {
  return useQuery({
    queryKey: ["events", page, search],
    queryFn: async() => {
        const { data } = await axiosInstance.get<PageableResponse<Event>>(
            "/events", {params: {page, search}}
        )
        return data;
    }
  })
}

export default useGetEvents