import { AlertTriangle, BadgeCheck, Lock, ShieldCheck, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageLayout from "@/components/sections/PageLayout";

type Guideline = { icon: LucideIcon; title: string; description: string };

const guidelines: Guideline[] = [
  {
    icon: BadgeCheck,
    title: "Verified organizers",
    description:
      "Every organizer goes through a review process before they can sell tickets on Evora.",
  },
  {
    icon: Lock,
    title: "Secure payments",
    description:
      "Transactions are encrypted and processed through trusted payment providers.",
  },
  {
    icon: UserCheck,
    title: "Buy with confidence",
    description:
      "Your e-ticket is guaranteed. If an event is cancelled, we'll help you get sorted.",
  },
  {
    icon: AlertTriangle,
    title: "Report a concern",
    description:
      "Spot something suspicious? Report it and our trust & safety team will investigate.",
  },
];

const tips = [
  "Only purchase tickets through the official Evora platform.",
  "Never share your password or one-time codes with anyone.",
  "Be cautious of deals that seem too good to be true.",
  "Check event details and organizer profiles before you buy.",
];

const Safety = () => (
  <PageLayout
    eyebrow="Safety"
    title="Your safety is our priority"
    description="We work hard to keep Evora a trusted place to discover, buy and host events."
    icon={ShieldCheck}
  >
    {/* Guidelines */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {guidelines.map((guideline) => {
        const Icon = guideline.icon;
        return (
          <div
            key={guideline.title}
            className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff]"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
              <Icon className="size-6" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1e1b2e]">
                {guideline.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#52525b]">
                {guideline.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    {/* Safety tips */}
    <div className="mt-16 overflow-hidden rounded-3xl bg-[#6d28d9] px-6 py-12 md:px-12 md:py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Stay safe: quick tips
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-3 text-white/90">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-white" />
              <span className="text-[15px] leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </PageLayout>
);

export default Safety;
