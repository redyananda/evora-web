import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Homepage/Hero";
import UpcomingEventPage from "@/components/sections/Homepage/UpcomingEventPage";
import Navbar from "@/components/sections/Navbar";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

const Home = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [category, setCategory] = useState("All");
  // const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  // const [debounceSearch] = useDebounceValue(search, 500);

  const {data: events, isPending}= useGetEvents({
    page,
    category: category === "All" ? undefined : category,
    // search: debounceSearch,
  })
  return (
    <div>
      <Navbar />
      <Hero />
      <UpcomingEventPage
        events={events}
        isPending={isPending}
        setPage={setPage}
        category={category}
        setCategory={setCategory}
      />
      <Footer />
    </div>
  );
};

export default Home;
