import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeft,
  CalendarRange,
  LayoutDashboard,
  ReceiptText,
  TicketPercent,
  UserRound,
  Users,
} from "lucide-react";
import EventsPanel from "@/components/organizer/EventsPanel";
import ParticipantsPanel from "@/components/organizer/ParticipantsPanel";
import StatisticsPanel from "@/components/organizer/StatisticsPanel";
import TransactionsPanel from "@/components/organizer/TransactionsPanel";
import VouchersPanel from "@/components/organizer/VouchersPanel";
import { useOrganizerDashboard } from "@/hooks/api/organizer/useOrganizer";
import { useAuthStore } from "@/store/auth.store";
import type { StatisticPeriod } from "@/types/organizer";

type DashboardTab = "overview" | "events" | "promotions" | "transactions" | "participants";

const tabs: Array<{ key: DashboardTab; label: string; icon: typeof LayoutDashboard }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: CalendarRange },
  { key: "promotions", label: "Promotions", icon: TicketPercent },
  { key: "transactions", label: "Transactions", icon: ReceiptText },
  { key: "participants", label: "Participants", icon: Users },
];

const currentLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const OrganizerDashboard = () => {
  const [params, setParams] = useSearchParams();
  const requestedTab = params.get("tab") as DashboardTab | null;
  const activeTab = tabs.some((tab) => tab.key === requestedTab) ? requestedTab! : "overview";
  const [period, setPeriod] = useState<StatisticPeriod>("month");
  const [date, setDate] = useState(currentLocalDate);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useOrganizerDashboard(period, date);

  const selectTab = (tab: DashboardTab) => {
    const next = new URLSearchParams(params);
    if (tab === "overview") next.delete("tab");
    else next.set("tab", tab);
    setParams(next);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ff] text-[#211333]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-purple-100 bg-white p-5 lg:flex">
        <Link to="/" className="mb-8 block px-2"><img src="/navLogo.webp" alt="Evora" className="w-32" /></Link>
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#9333ea] p-4 text-white">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/15"><UserRound className="size-5" /></div>
          <p className="mt-4 text-xs text-purple-100">Organizer workspace</p>
          <p className="truncate font-semibold">{user?.firstName} {user?.lastName}</p>
        </div>
        <nav className="space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => selectTab(key)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === key ? "bg-purple-100 text-purple-800" : "text-zinc-500 hover:bg-purple-50 hover:text-purple-700"}`}>
              <Icon className="size-5" /> {label}
              {key === "transactions" && (data?.summary.pendingTransactions ?? 0) > 0 && <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[11px] text-white">{data?.summary.pendingTransactions}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-purple-100 pt-4">
          <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-500 hover:bg-purple-50 hover:text-purple-700"><UserRound className="size-5" /> Profile settings</Link>
          <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-500 hover:bg-purple-50 hover:text-purple-700"><ArrowLeft className="size-5" /> Back to Evora</Link>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-purple-100 bg-white/90 px-4 py-3 backdrop-blur-lg sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <Link to="/" className="lg:hidden"><img src="/navLogo.webp" alt="Evora" className="w-24" /></Link>
            <div className="hidden lg:block"><p className="text-sm font-semibold text-[#211333]">Organizer Dashboard</p><p className="text-xs text-zinc-500">Manage your Evora business in one place</p></div>
            <Link to="/profile" className="flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700"><UserRound className="size-4" /> {user?.firstName}</Link>
          </div>
          <nav className="mx-auto mt-3 flex max-w-[1500px] gap-1 overflow-x-auto lg:hidden">
            {tabs.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => selectTab(key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${activeTab === key ? "bg-purple-100 text-purple-800" : "text-zinc-500"}`}><Icon className="size-4" /> {label}</button>)}
          </nav>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {isError && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Dashboard data could not be loaded. Make sure the API is running and your organizer session is valid.</div>}
          {activeTab === "overview" && <StatisticsPanel data={data} isLoading={isLoading} period={period} date={date} onPeriodChange={setPeriod} onDateChange={setDate} />}
          {activeTab === "events" && <EventsPanel />}
          {activeTab === "promotions" && <VouchersPanel />}
          {activeTab === "transactions" && <TransactionsPanel />}
          {activeTab === "participants" && <ParticipantsPanel />}
        </main>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
