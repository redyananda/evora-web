import { axiosInstance } from "@/lib/axios";
import type { Event } from "@/types/event";
import type { PageableResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";


interface GetEventsQuery {
    page: number;
    search?: string;
    category?: string;
}


const useGetEvents = ({page, search, category}: GetEventsQuery) => {
  return useQuery({
    queryKey: ["events", page, search, category],
    queryFn: async() => {
        const { data } = await axiosInstance.get<PageableResponse<Event>>(
            "/events", {params: {page, search, category}}
        )
        return data;
    }
  })
}

export default useGetEvents