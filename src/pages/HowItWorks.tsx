import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  PartyPopper,
  Search,
  Ticket,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const customerSteps: Step[] = [
  {
    icon: Search,
    title: "Find your ticket",
    description:
      "Head to Discover and browse thousands of concerts, festivals, workshops and meetups across Indonesia.",
  },
  {
    icon: Ticket,
    title: "Buy the ticket",
    description:
      "Pick the event you love, choose how many tickets you need and start your order in seconds.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    description:
      "Complete your payment through our secure checkout. Your e-ticket is issued the moment it clears.",
  },
  {
    icon: PartyPopper,
    title: "Enjoy the event",
    description:
      "All done! Show your e-ticket at the gate, walk in and enjoy the show. That's it.",
  },
];

const organizerSteps: Step[] = [
  {
    icon: UserPlus,
    title: "Sign up as an organizer",
    description:
      "Create an account and simply choose 'Event Organizer' when you register. No approval needed — you're ready right away.",
  },
  {
    icon: CalendarPlus,
    title: "Create your event",
    description:
      "Set up your event details, upload your poster and publish it in just a few minutes.",
  },
  {
    icon: Ticket,
    title: "Sell tickets",
    description:
      "Share your event, start selling tickets and reach thousands of attendees on Evora.",
  },
];

type Audience = "customer" | "organizer";

const tabs: { key: Audience; label: string }[] = [
  { key: "customer", label: "For Attendees" },
  { key: "organizer", label: "For Organizers" },
];

const StepCard = ({ step, index }: { step: Step; index: number }) => {
  const Icon = step.icon;
  return (
    <div className="relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff] transition-shadow hover:shadow-md md:p-7">
      <span className="absolute right-6 top-6 font-heading text-4xl font-bold text-[#f0e8ff]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex size-12 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-5 font-heading text-lg font-bold text-[#1e1b2e]">
        {step.title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#52525b]">
        {step.description}
      </p>
    </div>
  );
};

const HowItWorks = () => {
  const [audience, setAudience] = useState<Audience>("customer");
  const steps = audience === "customer" ? customerSteps : organizerSteps;

  return (
    <div className="min-h-screen bg-[#f3edff]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f1ff]">
        <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-[#c4b5fd]/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:px-12 lg:px-16 lg:py-20">
          <span className="inline-block rounded-full bg-[#6d28d9]/10 px-4 py-1.5 text-sm font-semibold text-[#6d28d9]">
            How it works
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-[#1e1b2e] sm:text-5xl">
            From finding events to {" "}
            <span className="bg-linear-to-r from-[#6d28d9] to-[#a855f7] bg-clip-text text-transparent">
              showing up
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#52525b]">
            Whether you're here to attend an event or host one, getting started
            on Evora takes just a few simple steps.
          </p>

          {/* Tabs */}
          <div className="mt-10 inline-flex rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-[#efe7ff]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setAudience(tab.key)}
                className={`rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-colors sm:px-8 ${
                  audience === tab.key
                    ? "bg-[#6d28d9] text-white shadow-sm"
                    : "text-[#3f3f46] hover:bg-[#f3edff] hover:text-[#6d28d9]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-[#1e1b2e] sm:text-3xl">
            {audience === "customer"
              ? "Get your tickets in 4 easy steps"
              : "Start hosting in 3 easy steps"}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#52525b]">
            {audience === "customer"
              ? "Search, buy, pay, and you're in. No hassle, no queues."
              : "Sign up as an organizer and bring your event to life."}
          </p>
        </div>

        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
            audience === "customer" ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-[#6d28d9] px-6 py-12 text-center shadow-lg md:px-12 md:py-16">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            {audience === "customer"
              ? "Ready to find your next event?"
              : "Ready to host your event?"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
            {audience === "customer"
              ? "Thousands of events are waiting for you. Start exploring now."
              : "Join our community of organizers and reach thousands of attendees."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {audience === "customer" ? (
              <Link to="/#discover">
                <Button className="h-12 rounded-xl bg-white px-7 text-base font-semibold text-[#6d28d9] shadow-sm hover:bg-[#f3edff]">
                  Discover events
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button className="h-12 rounded-xl bg-white px-7 text-base font-semibold text-[#6d28d9] shadow-sm hover:bg-[#f3edff]">
                  <UserPlus className="size-5" />
                  Sign up as organizer
                </Button>
              </Link>
            )}
          </div>
          {audience === "organizer" && (
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/70">
              <CheckCircle2 className="size-4" />
              It's free to get started — no application or approval required.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
