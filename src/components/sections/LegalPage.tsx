import type { LucideIcon } from "lucide-react";
import PageLayout from "@/components/sections/PageLayout";

export type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lastUpdated: string;
  sections: LegalSection[];
};

/**
 * Prose layout used by the legal footer pages (Privacy, Terms, Cookies).
 * Content is placeholder copy for demonstration purposes only.
 */
const LegalPage = ({
  eyebrow,
  title,
  description,
  icon,
  lastUpdated,
  sections,
}: LegalPageProps) => {
  return (
    <PageLayout eyebrow={eyebrow} title={title} description={description} icon={icon}>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff] md:p-10">
          <p className="text-sm font-medium text-[#6d28d9]">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-8 space-y-10">
            {sections.map((section, index) => (
              <section key={section.heading}>
                <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
                  {index + 1}. {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-relaxed text-[#52525b]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-10 rounded-xl bg-[#f7f1ff] px-5 py-4 text-sm leading-relaxed text-[#6b6580]">
            This is placeholder content for demonstration purposes and does not
            constitute a real legal agreement. Replace it with copy reviewed by
            your legal team before launch.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LegalPage;
