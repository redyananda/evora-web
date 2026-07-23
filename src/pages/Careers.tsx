import { ArrowRight, Briefcase, Coffee, Globe, HeartHandshake, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/sections/PageLayout";

type Perk = { icon: LucideIcon; title: string; description: string };

const perks: Perk[] = [
  {
    icon: Globe,
    title: "Remote friendly",
    description: "Work from anywhere with flexible hours that fit your life.",
  },
  {
    icon: Rocket,
    title: "Grow fast",
    description: "Take on real ownership and learn quickly in a growing team.",
  },
  {
    icon: HeartHandshake,
    title: "Great benefits",
    description: "Health coverage, learning budget and paid time off.",
  },
  {
    icon: Coffee,
    title: "Free event tickets",
    description: "Enjoy events on us — because we love them as much as you do.",
  },
];

type Opening = { role: string; team: string; location: string; type: string };

const openings: Opening[] = [
  { role: "Senior Frontend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { role: "Product Designer", team: "Design", location: "Jakarta", type: "Full-time" },
  { role: "Customer Support Specialist", team: "Support", location: "Remote", type: "Full-time" },
  { role: "Growth Marketing Manager", team: "Marketing", location: "Bandung", type: "Full-time" },
];

const Careers = () => (
  <PageLayout
    eyebrow="Careers"
    title="Come build the future of events"
    description="We're a small, passionate team on a mission to make live experiences accessible to everyone. Want in?"
    icon={Briefcase}
  >
    {/* Perks */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {perks.map((perk) => {
        const Icon = perk.icon;
        return (
          <div
            key={perk.title}
            className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff]"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 font-heading text-base font-bold text-[#1e1b2e]">
              {perk.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#52525b]">
              {perk.description}
            </p>
          </div>
        );
      })}
    </div>

    {/* Openings */}
    <div className="mt-16">
      <h2 className="font-heading text-2xl font-bold text-[#1e1b2e] sm:text-3xl">
        Open positions
      </h2>
      <div className="mt-6 space-y-3">
        {openings.map((opening) => (
          <div
            key={opening.role}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efe7ff] transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:p-6"
          >
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1e1b2e]">
                {opening.role}
              </h3>
              <p className="mt-1 text-sm text-[#52525b]">
                {opening.team} · {opening.location} · {opening.type}
              </p>
            </div>
            <Link to="#">
              <Button className="rounded-xl bg-[#6d28d9] px-5 font-semibold text-white hover:bg-[#5b21b6]">
                Apply
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </PageLayout>
);

export default Careers;
