import { CalendarCheck, MessageSquareQuote, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import useGetOrganizerProfile from "@/hooks/api/organizer/useGetOrganizerProfile";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const StarRow = ({ value, size = "size-4" }: { value: number; size?: string }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={
          index < Math.round(value)
            ? `${size} fill-[#fbbf24] text-[#fbbf24]`
            : `${size} fill-[#e4e4e7] text-[#e4e4e7]`
        }
      />
    ))}
  </span>
);

const OrganizerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: organizer, isPending, isError } = useGetOrganizerProfile(id ?? "");

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

  if (isError || !organizer) {
    return (
      <div className="min-h-screen bg-[#f3edff]">
        <Navbar />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-[#1e1b2e]">
            Organizer not found
          </h1>
          <p className="text-[15px] text-[#52525b]">
            The organizer you're looking for doesn't exist or has been removed.
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

  const { reviews, rating, totalReviews } = organizer;

  return (
    <div className="min-h-screen bg-[#f3edff]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-8 md:px-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to="/#discover"
            className="text-[#71717a] transition-colors hover:text-[#6d28d9]"
          >
            Explore
          </Link>
          <span className="text-[#a1a1aa]">›</span>
          <span className="font-semibold text-[#6d28d9]">
            {organizer.organizerName}
          </span>
        </nav>

        {/* Organizer header */}
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
            <img
              src={organizer.organizerLogo || "/navLogo.webp"}
              alt={organizer.organizerName}
              className="size-24 shrink-0 rounded-2xl object-contain p-3 ring-1 ring-[#efe7ff]"
            />
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-bold text-[#1e1b2e] md:text-3xl">
                {organizer.organizerName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <StarRow value={rating} />
                  <span className="text-sm font-semibold text-[#1e1b2e]">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-[#71717a]">
                    ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-[#52525b]">
                  <CalendarCheck className="size-4 text-[#6d28d9]" />
                  {organizer.totalEvents}{" "}
                  {organizer.totalEvents === 1 ? "event" : "events"} hosted
                </span>
                <span className="text-sm text-[#a1a1aa]">
                  Member since {formatDate(organizer.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-[#efe7ff] pt-6">
            <h2 className="font-heading text-lg font-bold text-[#1e1b2e]">
              About
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#52525b]">
              {organizer.organizerDescription?.trim() ||
                "This organizer hasn't added a description yet."}
            </p>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="size-5 text-[#6d28d9]" />
            <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
              Reviews
            </h2>
            <span className="text-sm text-[#71717a]">({totalReviews})</span>
          </div>

          {reviews.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[#d6c9ff] bg-white p-10 text-center shadow-sm">
              <MessageSquareQuote className="mx-auto size-8 text-[#c4b5fd]" />
              <p className="mt-3 font-heading text-base font-bold text-[#1e1b2e]">
                No reviews yet
              </p>
              <p className="mt-1 text-sm text-[#71717a]">
                This organizer hasn't received any reviews from attendees yet.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
                >
                  <div className="flex items-start gap-4">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="size-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ede4ff] text-sm font-bold text-[#6d28d9]">
                        {initials(review.name)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <h3 className="font-heading text-[15px] font-bold text-[#1e1b2e]">
                          {review.name}
                        </h3>
                        <span className="text-xs text-[#a1a1aa]">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRow value={review.rating} size="size-3.5" />
                        <span className="truncate text-xs text-[#71717a]">
                          {review.eventName}
                        </span>
                      </div>
                      {review.comment?.trim() && (
                        <p className="mt-3 text-[15px] leading-relaxed text-[#52525b]">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrganizerProfile;
