import { Mail, MessageSquare, Share2 } from "lucide-react";
import { Link } from "react-router";

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Safety", to: "/safety" },
      { label: "Guides", to: "/guides" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
];

const socials = [
  { icon: Share2, label: "Share" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Mail, label: "Email" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#e9e3f7]">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="max-w-md">
            <Link to="/">
              <img className="w-32" src="/navLogo.webp" alt="Evora logo" />
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-[#52525b]">
              Empowering event organizers and attendees with seamless discovery
              and planning tools. Experience the best the world has to offer.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  to="#"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full bg-white text-[#1e1b2e] shadow-sm transition-colors hover:bg-[#6d28d9] hover:text-white"
                >
                  <Icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1e1b2e]">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[15px] text-[#52525b] transition-colors hover:text-[#6d28d9]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#d6cdec] pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-[#52525b]">
            © 2026 Evora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
