import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { Ticket } from "lucide-react";
import { Link } from "react-router";
import type { PageableResponse } from "@/types/pagination";
import type { Event } from "@/types/event";
import GlobalPagination from "@/components/sections/GlobalPagination";
import './UpcomingEventPage.css'

const categories = [
  "All",
  "Music",
  "Tech & Inovation",
  "Food & Drink",
  "Arts & Culture",
  "Business",
  "Wellness",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

interface GridProps {
  setPage: (page: number) => void;
  events: NoInfer<PageableResponse<Event>> | undefined;
  isPending: boolean;
}

const UpcomingEventPage = ({ events, isPending, setPage }: GridProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  return (
    <section id="discover" className="relative overflow-hidden bg-[#f7f1ff]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#1e1b2e] sm:text-4xl">
              Upcoming Events
            </h1>
            <p className="mt-2 text-base text-[#52525b]">
              Pick a category and city, or type straight into the search box.
            </p>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#6d28d9] hover:text-[#5b21b6]"
          >
            View all events
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mb-10 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-[#6d28d9] text-white shadow-sm shadow-[#6d28d9]/30"
                  : "border border-[#e4d9ff] bg-white text-[#52525b] hover:border-[#c4b5fd] hover:text-[#6d28d9]",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isPending && (
            <div className="col-span-full flex flex-col items-center gap-8 py-16">
              <span className="loader"></span>
              <span className="text-animated"></span>
            </div>
          )}

          {!isPending &&
            events?.data.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-[#6d28d9]/5 ring-1 ring-[#efe7ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6d28d9]/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.thumbnail}
                    alt={event.eventName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute right-4 top-4 flex flex-col items-center rounded-xl bg-white/95 px-3 py-1.5 leading-none shadow-md backdrop-blur">
                    <span className="text-xl font-bold text-[#6d28d9]">
                      {`${event.startDate.split("T")[0].split("-")[2]} ${months[Number(event.startDate.split("-")[1]) - 1]}`}
                    </span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-2xl font-semibold leading-tight text-[#1e1b2e]">
                    {event.eventName}
                  </h3>
                  <p className="mt-auto flex items-center gap-1.5 pt-3 text-[15px] text-[#52525b]">
                    <MapPin className="size-4 shrink-0 text-[#8b8b95]" />
                    {event.location}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 border-t border-[#efe7ff] pt-4">
                    <Ticket className="size-5 shrink-0 text-[#6d28d9]" />
                    <p className="text-lg font-bold leading-none text-[#6d28d9]">
                      IDR {event.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {!isPending && events && (
          <div className="py-8">
            <GlobalPagination
              currentPage={events.meta.page}
              totalPage={Math.ceil(events.meta.total / events.meta.take)}
              onChangePage={(p) => {
                setPage(p);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventPage;
