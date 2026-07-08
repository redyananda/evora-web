import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Homepage/Hero";
import UpcomingEventPage from "@/components/sections/Homepage/UpcomingEventPage";
import Navbar from "@/components/sections/Navbar";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { parseAsInteger, useQueryState } from "nuqs";

const Home = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  // const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  // const [debounceSearch] = useDebounceValue(search, 500);

  const {data: events, isPending}= useGetEvents({
    page,
    // search: debounceSearch,
  })
  return (
    <div>
      <Navbar />
      <Hero />
      <UpcomingEventPage events={events} isPending={isPending} setPage={setPage} />
      <Footer />
    </div>
  );
};

export default Home;
