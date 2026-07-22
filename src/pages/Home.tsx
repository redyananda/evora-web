import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Homepage/Hero";
import UpcomingEventPage from "@/components/sections/Homepage/UpcomingEventPage";
import Navbar from "@/components/sections/Navbar";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const scrollToDiscover = () => {
  document
    .getElementById("discover")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Home = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debounceSearch] = useDebounceValue(search, 500);
  const didMount = useRef(false);

  const { data: events, isPending } = useGetEvents({
    page,
    category: category === "All" ? undefined : category,
    search: debounceSearch || undefined,
  });

  // Reset to the first page and scroll down to the results whenever the
  // debounced search term changes so the matches are immediately visible.
  // Skip the initial mount to preserve deep-linked ?page & ?search params.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setPage(1);
    if (debounceSearch) {
      scrollToDiscover();
    }
  }, [debounceSearch, setPage]);

  return (
    <div>
      <Navbar />
      <Hero search={search} setSearch={setSearch} onSubmit={scrollToDiscover} />
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
