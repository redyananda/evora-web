import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { Ticket } from 'lucide-react';




const categories = [
  "All",
  "Music",
  "Tech & Inovation",
  "Food & Drink",
  "Arts & Culture",
  "Business",
  "Wellness",
];

const events = [
  {
    id: 1,
    title: "Lorem ipsum",
    location: "Lorem ipsum",
    day: "24",
    month: "JUL",
    price: "350.000",
    badge: "TRENDING",
    badgeColor: "bg-[#b91c1c]",
    image: "./thumbnailEvent.webp",
  },
  {
    id: 2,
    title: "Lorem ipsum",
    location: "Lorem ipsum",
    day: "28",
    month: "JUL",
    price: "150.000",
    badge: "NEW",
    badgeColor: "bg-[#4d5314]",
    image: "./thumbnailEvent.webp",
  },
  {
    id: 3,
    title: "Lorem ipsum",
    location: "Lorem ipsum",
    day: "02",
    month: "AUG",
    price: "250.000",
    badge: "LIMITED SEATS",
    badgeColor: "bg-[#ea580c]",
    image: "./thumbnailEvent.webp",
  },
  {
    id: 4,
    title: "Lorem ipsum",
    location: "Lorem ipsum",
    day: "15",
    month: "AUG",
    price: "1.250.000",
    badge: "",
    badgeColor: "",
    image: "./thumbnailEvent.webp",
  },
];

const UpcomingEventPage = () => {
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
          {events.map((event) => (
            <article
              key={event.id}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-[#6d28d9]/5 ring-1 ring-[#efe7ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6d28d9]/10"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {event.badge && (
                  <span
                    className={cn(
                      "absolute left-4 top-4 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white",
                      event.badgeColor,
                    )}
                  >
                    {event.badge}
                  </span>
                )}

                <span className="absolute right-4 top-4 flex flex-col items-center rounded-xl bg-white/95 px-3 py-1.5 leading-none shadow-md backdrop-blur">
                  <span className="text-xl font-bold text-[#6d28d9]">
                    {event.day}
                  </span>
                  <span className="text-[11px] font-semibold text-[#71717a]">
                    {event.month}
                  </span>
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-2xl font-semibold leading-tight text-[#1e1b2e]">
                  {event.title}
                </h3>
                <p className="mt-3 flex items-center gap-1.5 text-[15px] text-[#52525b]">
                  <MapPin className="size-4 shrink-0 text-[#8b8b95]" />
                  {event.location}
                </p>

                <div className="mt-auto flex items-center gap-1.5 border-t border-[#efe7ff] pt-4">
                  <Ticket className="size-5 shrink-0 text-[#6d28d9]" />
                  <p className="text-lg font-bold leading-none text-[#6d28d9]">
                    IDR {event.price}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventPage;
