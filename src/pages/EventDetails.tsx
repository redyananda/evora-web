import {
  Armchair,
  CalendarDays,
  Clock,
  Heart,
  MapPin,
  Minus,
  Plus,
  Share2,
  Star,
  TicketPercent,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";
import useGetEventVouchers from "@/hooks/api/event/useGetEventVouchers";
import { useAuthStore } from "@/store/auth.store";

const formatIDR = (value: number) =>
  value === 0 ? "Free" : `IDR ${value.toLocaleString("id-ID")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

const jakartaNow = () => {
  const parts = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });
  return new Date(`${parts.replace(" ", "T")}Z`).getTime();
};

const hasEventEnded = (endDate: string) =>
  new Date(endDate).getTime() < jakartaNow();

  function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const EventDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isPending, isError } = useGetEventBySlug(slug ?? "");
  const { data: vouchers } = useGetEventVouchers(slug ?? "");
  const user = useAuthStore((state) => state.user);
  const [quantity, setQuantity] = useState(1);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f3edff]">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="size-10 animate-spin rounded-full border-4 border-[#e4d9ff] border-t-[#6d28d9]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[#f3edff]">
        <Navbar />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-[#1e1b2e]">
            Event not found
          </h1>
          <p className="text-[15px] text-[#52525b]">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/#discover">
            <Button className="rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
              Back to events
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const maxPerOrder = Math.max(1, Math.min(3, event.availableSeats));
  const total = event.price * quantity;
  const paragraphs = event.description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    `${event.venue}, ${event.location}`,
  )}&output=embed`;

  return (
    <div className="min-h-screen bg-[#f3edff]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 lg:px-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to="/#discover"
            className="text-[#71717a] transition-colors hover:text-[#6d28d9]"
          >
            Explore
          </Link>
          <span className="text-[#a1a1aa]">›</span>
          <Link
            to="/#discover"
            className="text-[#71717a] transition-colors hover:text-[#6d28d9]"
          >
            {toTitleCase(event.category.replaceAll("_", (" ")))}
          </Link>
          <span className="text-[#a1a1aa]">›</span>
          <span className="font-semibold text-[#6d28d9]">{event.eventName}</span>
        </nav>

        {/* Hero banner */}
        <section className="relative overflow-hidden rounded-3xl shadow-lg">
          <img
            src={event.thumbnail}
            alt={event.eventName}
            className="h-90 w-full object-cover md:h-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <span className="inline-block rounded-full bg-[#fb923c] px-4 py-1.5 text-sm font-semibold text-white">
              {toTitleCase(event.category.replaceAll("_", (" ")))}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {event.eventName}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-white/95 md:text-base">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-5" />
                {formatDate(event.startDate)}{" "}-{" "}{formatDate(event.endDate)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-5" />
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-5" />
                {event.venue}{", "}{event.location}
              </span>
            </div>
          </div>
        </section>

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* About */}
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
                About this Event
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[#52525b]">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Organizer */}
            <Link
              to={`/organizers/${event.organizer.id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={event.organizer.organizerLogo || "/navLogo.webp"}
                  alt={event.organizer.organizerName}
                  className="size-14 rounded-xl object-contain p-2 ring-1 ring-[#efe7ff]"
                />
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1e1b2e] transition-colors hover:text-[#6d28d9]">
                    {event.organizer.organizerName}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={
                            index < Math.round(event.organizer.rating)
                              ? "size-4 fill-[#fbbf24] text-[#fbbf24]"
                              : "size-4 fill-[#e4e4e7] text-[#e4e4e7]"
                          }
                        />
                      ))}
                    </span>
                    <span className="text-sm font-semibold text-[#1e1b2e]">
                      {event.organizer.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-[#71717a]">
                      ({event.organizer.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Location */}
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
                Location
              </h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#efe7ff]">
                <iframe
                  title="Event location map"
                  src={mapEmbed}
                  className="h-64 w-full border-0"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#52525b]">
                <MapPin className="size-5 text-[#6d28d9]" />
                {event.venue}, {event.location}
              </p>
            </div>
          </div>

          {/* Right column */}
          <aside className="flex flex-col gap-6">
            {/* Booking card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-start justify-between">
                <span className="max-w-28 text-xs font-semibold uppercase tracking-wide text-[#71717a]">
                  Price
                </span>
                <span className="font-heading text-2xl font-bold text-[#6d28d9]">
                  {formatIDR(event.price)}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f7f1ff] px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-[#3f3f46]">
                  <Armchair className="size-5 text-[#6d28d9]" />
                  Available Seats
                </span>
                <span className="text-sm font-semibold text-[#ef4444]">
                  {event.availableSeats} left
                </span>
              </div>

              {/* Available voucher promotions */}
              {vouchers && vouchers.length > 0 && (
                <div className="mt-6 rounded-xl border border-dashed border-[#c4b5fd] bg-[#faf7ff] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#6d28d9]">
                    <TicketPercent className="size-4" />
                    Available promos
                  </div>
                  <div className="mt-3 space-y-2">
                    {vouchers.map((voucher) => (
                      <div
                        key={voucher.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-[#e4d9ff] bg-white px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="font-heading text-sm font-bold tracking-wide text-[#1e1b2e]">
                            {voucher.code}
                          </p>
                          <p className="text-xs text-[#71717a]">
                            {voucher.availableVoucher} left
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#ede4ff] px-2.5 py-1 text-xs font-bold text-[#6d28d9]">
                          -{formatIDR(voucher.discount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#a1a1aa]">
                    Apply your code at checkout.
                  </p>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-[#3f3f46]">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex size-9 items-center justify-center rounded-lg border border-[#e4d9ff] text-[#6d28d9] transition-colors hover:bg-[#f3edff] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center text-base font-semibold text-[#1e1b2e]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((q) => Math.min(maxPerOrder, q + 1))
                    }
                    disabled={quantity >= maxPerOrder}
                    className="flex size-9 items-center justify-center rounded-lg border border-[#e4d9ff] text-[#6d28d9] transition-colors hover:bg-[#f3edff] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mt-5 flex items-center justify-between border-t border-[#efe7ff] pt-4">
                <div>
                  <span className="text-sm font-medium text-[#3f3f46]">
                    Total
                  </span>
                  <p className="text-xs text-[#a1a1aa]">Before tax &amp; fees</p>
                </div>
                <span className="font-heading text-xl font-bold text-[#1e1b2e]">
                  {formatIDR(total)}
                </span>
              </div>

              {hasEventEnded(event.endDate) ? (
                <Button
                  disabled
                  className="mt-5 h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Event has ended
                </Button>
              ) : event.availableSeats <= 0 ? (
                <Button
                  disabled
                  className="mt-5 h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sold Out
                </Button>
              ) : user?.userRole === "ORGANIZER" ? (
                <Button
                  disabled
                  className="mt-5 h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Customer account required
                </Button>
              ) : (
                <Link to={`/events/${event.slug}/purchase?tickets=${quantity}`}>
                  <Button className="mt-5 h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
                    Book Now
                  </Button>
                </Link>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button className="border border-[#e4d9ff] bg-white text-[15px] font-semibold text-[#3f3f46] shadow-none hover:bg-[#f3edff]">
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button className="border border-[#e4d9ff] bg-white text-[15px] font-semibold text-[#3f3f46] shadow-none hover:bg-[#f3edff]">
                  <Heart className="size-4" />
                  Save
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetails;
