import { Building2, Heart, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageLayout from "@/components/sections/PageLayout";

type Value = { icon: LucideIcon; title: string; description: string };

const values: Value[] = [
  {
    icon: Sparkles,
    title: "Unforgettable moments",
    description:
      "We believe live events create memories that last a lifetime, and we work to make them easy to find and attend.",
  },
  {
    icon: Users,
    title: "Community first",
    description:
      "From indie meetups to sold-out festivals, we empower organizers of every size to grow their audience.",
  },
  {
    icon: Heart,
    title: "Built with care",
    description:
      "Every feature is designed to make discovering, booking and hosting events feel effortless and delightful.",
  },
];

const stats = [
  { value: "10K+", label: "Events hosted" },
  { value: "500K+", label: "Tickets sold" },
  { value: "1.2K+", label: "Organizers" },
  { value: "34", label: "Cities" },
];

const AboutUs = () => (
  <PageLayout
    eyebrow="About Us"
    title={
      <>
        Bringing people together,{" "}
        <span className="bg-linear-to-r from-[#6d28d9] to-[#a855f7] bg-clip-text text-transparent">
          one event at a time
        </span>
      </>
    }
    description="Evora is the platform that connects event organizers and attendees with seamless discovery and planning tools."
    icon={Building2}
  >
    {/* Stats */}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#efe7ff]"
        >
          <p className="font-heading text-3xl font-bold text-[#6d28d9]">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-[#52525b]">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Story */}
    <div className="mx-auto mt-16 max-w-3xl text-center">
      <h2 className="font-heading text-2xl font-bold text-[#1e1b2e] sm:text-3xl">
        Our story
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[#52525b]">
        Evora started with a simple idea: finding and hosting great events
        should be effortless. What began as a small project has grown into a
        thriving marketplace where organizers reach new audiences and attendees
        discover experiences they love. Today we're proud to power thousands of
        events across the country, and we're just getting started.
      </p>
    </div>

    {/* Values */}
    <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {values.map((value) => {
        const Icon = value.icon;
        return (
          <div
            key={value.title}
            className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff] transition-shadow hover:shadow-md md:p-7"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-bold text-[#1e1b2e]">
              {value.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#52525b]">
              {value.description}
            </p>
          </div>
        );
      })}
    </div>
  </PageLayout>
);

export default AboutUs;
