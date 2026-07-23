import { ShieldCheck } from "lucide-react";
import LegalPage from "@/components/sections/LegalPage";
import type { LegalSection } from "@/components/sections/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "Information We Collect",
    body: [
      "We collect information you provide directly to us, such as your name, email address and payment details when you create an account or purchase a ticket.",
      "We also automatically collect certain technical data, including your device type, browser and how you interact with the platform.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "Your information helps us process orders, issue e-tickets, provide customer support and improve the Evora experience.",
      "We may send you transactional messages about your purchases and, with your consent, occasional updates about events you might like.",
    ],
  },
  {
    heading: "Sharing Your Information",
    body: [
      "We share limited information with event organizers so they can manage attendance, and with payment providers to complete transactions.",
      "We never sell your personal data to third parties.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You can access, update or delete your personal information at any time from your account settings, or by contacting our support team.",
    ],
  },
];

const PrivacyPolicy = () => (
  <LegalPage
    eyebrow="Privacy Policy"
    title="Your privacy matters"
    description="How Evora collects, uses and protects your personal information."
    icon={ShieldCheck}
    lastUpdated="July 2026"
    sections={sections}
  />
);

export default PrivacyPolicy;
