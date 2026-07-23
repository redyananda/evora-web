import { Cookie } from "lucide-react";
import LegalPage from "@/components/sections/LegalPage";
import type { LegalSection } from "@/components/sections/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "What Are Cookies",
    body: [
      "Cookies are small text files stored on your device that help websites remember information about your visit.",
    ],
  },
  {
    heading: "How We Use Cookies",
    body: [
      "We use essential cookies to keep you signed in and to remember items in your cart.",
      "We also use analytics cookies to understand how visitors use Evora so we can improve it.",
    ],
  },
  {
    heading: "Types of Cookies We Use",
    body: [
      "Essential cookies are required for the platform to function. Preference cookies remember your settings. Analytics cookies help us measure performance.",
    ],
  },
  {
    heading: "Managing Cookies",
    body: [
      "You can control and delete cookies through your browser settings. Note that disabling essential cookies may affect how Evora works.",
    ],
  },
];

const CookiePolicy = () => (
  <LegalPage
    eyebrow="Cookie Policy"
    title="How we use cookies"
    description="Learn about the cookies Evora uses and how you can control them."
    icon={Cookie}
    lastUpdated="July 2026"
    sections={sections}
  />
);

export default CookiePolicy;
