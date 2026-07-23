import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

type PageLayoutProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  icon?: LucideIcon;
  children: ReactNode;
};

/**
 * Shared scaffold for the static/marketing pages linked from the footer.
 * Renders the Navbar, a themed hero, the page body and the Footer.
 */
const PageLayout = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f3edff]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f1ff]">
        <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-[#c4b5fd]/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:px-12 lg:px-16 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#6d28d9]/10 px-4 py-1.5 text-sm font-semibold text-[#6d28d9]">
            {Icon && <Icon className="size-4" />}
            {eyebrow}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-[#1e1b2e] sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#52525b]">
            {description}
          </p>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-16 lg:py-20">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PageLayout;
