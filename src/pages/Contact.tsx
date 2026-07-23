import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/sections/PageLayout";

type Channel = { icon: LucideIcon; title: string; value: string; hint: string };

const channels: Channel[] = [
  {
    icon: Mail,
    title: "Email us",
    value: "hello@evora.com",
    hint: "We usually reply within a day.",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+62 21 1234 5678",
    hint: "Mon–Fri, 9am – 6pm WIB.",
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: "Jakarta, Indonesia",
    hint: "Jl. Sudirman No. 10, 12190.",
  },
];

const Contact = () => (
  <PageLayout
    eyebrow="Contact"
    title="We'd love to hear from you"
    description="Have a question, a partnership idea or just want to say hello? Reach out and our team will get back to you."
    icon={MessageCircle}
  >
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Channels */}
      <div className="space-y-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.title}
              className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efe7ff] md:p-6"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9]">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-bold text-[#1e1b2e]">
                  {channel.title}
                </h3>
                <p className="mt-0.5 text-[15px] font-medium text-[#6d28d9]">
                  {channel.value}
                </p>
                <p className="mt-0.5 text-sm text-[#52525b]">{channel.hint}</p>
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-3 rounded-2xl bg-[#f7f1ff] px-5 py-4 text-sm text-[#6b6580]">
          <Clock className="size-5 shrink-0 text-[#6d28d9]" />
          Average response time is under 24 hours on business days.
        </div>
      </div>

      {/* Form (non-functional demo) */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#efe7ff] md:p-8">
        <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
          Send us a message
        </h2>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#3f3f46]">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-1.5 w-full rounded-xl border border-[#e4dcf5] bg-[#faf8ff] px-4 py-2.5 text-[15px] text-[#1e1b2e] outline-none focus:border-[#6d28d9] focus:ring-1 focus:ring-[#6d28d9]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3f3f46]">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-[#e4dcf5] bg-[#faf8ff] px-4 py-2.5 text-[15px] text-[#1e1b2e] outline-none focus:border-[#6d28d9] focus:ring-1 focus:ring-[#6d28d9]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#3f3f46]">Message</label>
            <textarea
              rows={5}
              placeholder="How can we help?"
              className="mt-1.5 w-full resize-none rounded-xl border border-[#e4dcf5] bg-[#faf8ff] px-4 py-2.5 text-[15px] text-[#1e1b2e] outline-none focus:border-[#6d28d9] focus:ring-1 focus:ring-[#6d28d9]"
            />
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white hover:bg-[#5b21b6]"
          >
            <Send className="size-5" />
            Send message
          </Button>
        </form>
      </div>
    </div>
  </PageLayout>
);

export default Contact;
