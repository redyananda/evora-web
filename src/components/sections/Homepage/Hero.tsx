import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, TicketIcon } from "lucide-react";

interface HeroProps {
  search: string;
  setSearch: (value: string) => void;
  onSubmit?: () => void;
}

const Hero = ({ search, setSearch, onSubmit }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-[#f7f1ff]">
      <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-[#c4b5fd]/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:px-12 lg:grid-cols-2 lg:gap-8 lg:px-16 lg:py-20">
        <div className="flex flex-col items-start">
          <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-[#1e1b2e] sm:text-5xl lg:text-6xl">
            Find events. Get tickets.{" "}
            <span className="bg-linear-to-r from-[#6d28d9] to-[#a855f7] bg-clip-text text-transparent">
              Show up.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#52525b]">
            Thousands of events across Indonesia in one place. Concerts,
            workshops, festivals, meetups. Book your tickets in minutes.
          </p>

          <Field className="mt-8 w-full max-w-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.();
              }}
            >
              <InputGroup className="h-14 rounded-2xl border-[#e4d9ff] bg-white shadow-lg shadow-[#6d28d9]/5">
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="text-[#8b8b95]" />
                </InputGroupAddon>
                <InputGroupInput
                  id="hero-search-input"
                  className="text-base"
                  placeholder="Search by event name, city or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="submit"
                    className="rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]"
                  >
                    Search
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </Field>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div
            className="absolute inset-0 -z-10 mx-auto h-3/4 w-3/4 self-center rounded-full bg-[#6d28d9]/20 blur-3xl"
          />
          <img
            className="w-full max-w-md rotate-3 rounded-2xl shadow-2xl shadow-[#6d28d9]/25 transition-transform duration-500 hover:rotate-0"
            src="./heroImg.webp"
            alt="Concert ticket for CRO Live in Concert 2026 Tour"
          />
          <span className="absolute -bottom-4 -left-2 flex items-center gap-2 rounded-2xl border border-[#efe7ff] bg-white px-4 py-3 shadow-xl lg:-left-6">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
              <TicketIcon className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-[#1e1b2e]">
                Instant e-tickets
              </span>
              <span className="block text-xs text-[#71717a]">
                Delivered in seconds
              </span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
