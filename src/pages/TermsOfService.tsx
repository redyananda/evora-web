import { ScrollText } from "lucide-react";
import LegalPage from "@/components/sections/LegalPage";
import type { LegalSection } from "@/components/sections/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using Evora, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
    ],
  },
  {
    heading: "Your Account",
    body: [
      "You are responsible for keeping your login credentials secure and for all activity that happens under your account.",
      "You must provide accurate information and be at least 18 years old, or have the consent of a parent or guardian, to use Evora.",
    ],
  },
  {
    heading: "Tickets and Payments",
    body: [
      "All ticket purchases are subject to availability and the terms set by each event organizer.",
      "Prices are shown at checkout. Refunds and cancellations follow the policy of the specific event.",
    ],
  },
  {
    heading: "Prohibited Conduct",
    body: [
      "You agree not to resell tickets in violation of organizer rules, disrupt the platform, or use Evora for any unlawful purpose.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "Evora acts as a marketplace connecting attendees and organizers. We are not responsible for the conduct of organizers or the events themselves.",
    ],
  },
];

const TermsOfService = () => (
  <LegalPage
    eyebrow="Terms of Service"
    title="The rules of the road"
    description="The terms that govern your use of the Evora platform."
    icon={ScrollText}
    lastUpdated="July 2026"
    sections={sections}
  />
);

export default TermsOfService;
