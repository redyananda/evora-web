import { CreditCard, LifeBuoy, Search, Ticket, UserCog } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import PageLayout from "@/components/sections/PageLayout";

type Topic = { icon: LucideIcon; title: string; description: string };

const topics: Topic[] = [
  {
    icon: Ticket,
    title: "Tickets & orders",
    description: "Buying, viewing and managing your tickets.",
  },
  {
    icon: CreditCard,
    title: "Payments & refunds",
    description: "Payment methods, receipts and refund requests.",
  },
  {
    icon: UserCog,
    title: "Account & profile",
    description: "Sign-in issues, settings and account security.",
  },
  {
    icon: LifeBuoy,
    title: "For organizers",
    description: "Creating events and managing attendees.",
  },
];

const faqs = [
  {
    q: "How do I find my tickets?",
    a: "Your tickets live in your profile under the 'My Tickets' tab. You'll also receive them by email right after purchase.",
  },
  {
    q: "Can I get a refund?",
    a: "Refunds depend on the organizer's policy for that event. Check the event page or contact us and we'll help you out.",
  },
  {
    q: "How do I become an organizer?",
    a: "Reach out through our Contact page to apply. Once approved, you can start creating and selling events right away.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed through secure, encrypted providers. We never store your full card details.",
  },
];

const HelpCenter = () => (
  <PageLayout
    eyebrow="Help Center"
    title="How can we help?"
    description="Search our help articles or browse popular topics to get the answers you need."
    icon={LifeBuoy}
  >
    {/* Search (demo only) */}
    <div className="mx-auto -mt-4 mb-14 max-w-xl">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-sm ring-1 ring-[#efe7ff]">
        <Search className="size-5 text-[#9ca3af]" />
        <input
          type="text"
          placeholder="Search for help…"
          className="w-full bg-transparent text-[15px] text-[#1e1b2e] outline-none placeholder:text-[#9ca3af]"
        />
      </div>
    </div>

    {/* Topics */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {topics.map((topic) => {
        const Icon = topic.icon;
        return (
          <Link
            key={topic.title}
            to="#"
            className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff] transition-shadow hover:shadow-md"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 font-heading text-base font-bold text-[#1e1b2e]">
              {topic.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#52525b]">
              {topic.description}
            </p>
          </Link>
        );
      })}
    </div>

    {/* FAQ */}
    <div className="mx-auto mt-16 max-w-3xl">
      <h2 className="text-center font-heading text-2xl font-bold text-[#1e1b2e] sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-8 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efe7ff] md:p-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-heading text-base font-semibold text-[#1e1b2e]">
              {faq.q}
              <span className="ml-4 text-[#6d28d9] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-[#52525b]">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </PageLayout>
);

export default HelpCenter;
