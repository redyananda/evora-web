import { ArrowRight, BookOpen, Clock, Megaphone, Ticket, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import PageLayout from "@/components/sections/PageLayout";

type Guide = {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  readTime: string;
};

const guides: Guide[] = [
  {
    icon: Ticket,
    category: "For attendees",
    title: "How to buy your first ticket on Evora",
    description:
      "A step-by-step walkthrough from finding an event to showing your e-ticket at the gate.",
    readTime: "4 min read",
  },
  {
    icon: Megaphone,
    category: "For organizers",
    title: "Launching your first event",
    description:
      "Everything you need to set up, publish and start selling tickets to your event.",
    readTime: "6 min read",
  },
  {
    icon: TrendingUp,
    category: "For organizers",
    title: "5 tips to sell more tickets",
    description:
      "Proven strategies to promote your event and reach a bigger audience.",
    readTime: "5 min read",
  },
  {
    icon: BookOpen,
    category: "Getting started",
    title: "Making the most of your Evora profile",
    description:
      "Set up your account, manage your orders and personalize your experience.",
    readTime: "3 min read",
  },
];

const Guides = () => (
  <PageLayout
    eyebrow="Guides"
    title="Guides & resources"
    description="Practical tips and step-by-step guides to help you get the most out of Evora, whether you attend or host."
    icon={BookOpen}
  >
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {guides.map((guide) => {
        const Icon = guide.icon;
        return (
          <Link
            key={guide.title}
            to="#"
            className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff] transition-shadow hover:shadow-md md:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
                <Icon className="size-5" />
              </span>
              <span className="rounded-full bg-[#f3edff] px-3 py-1 text-xs font-semibold text-[#6d28d9]">
                {guide.category}
              </span>
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-[#1e1b2e]">
              {guide.title}
            </h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#52525b]">
              {guide.description}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-[#52525b]">
                <Clock className="size-4" />
                {guide.readTime}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#6d28d9]">
                Read
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  </PageLayout>
);

export default Guides;
