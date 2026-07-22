import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Banknote,
  CalendarCheck2,
  CalendarRange,
  Clock3,
  LoaderCircle,
  TicketCheck,
} from "lucide-react";
import type { OrganizerDashboardData, StatisticPeriod } from "@/types/organizer";

interface StatisticsPanelProps {
  data?: OrganizerDashboardData;
  isLoading: boolean;
  period: StatisticPeriod;
  date: string;
  onPeriodChange: (period: StatisticPeriod) => void;
  onDateChange: (date: string) => void;
}

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);

const formatFullIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const StatisticsPanel = ({
  data,
  isLoading,
  period,
  date,
  onPeriodChange,
  onDateChange,
}: StatisticsPanelProps) => {
  const summary = data?.summary;
  const cards = [
    { label: "Revenue", value: formatFullIDR(summary?.revenue ?? 0), icon: Banknote, tone: "bg-violet-100 text-violet-700" },
    { label: "Tickets sold", value: (summary?.ticketsSold ?? 0).toLocaleString("id-ID"), icon: TicketCheck, tone: "bg-orange-100 text-orange-700" },
    { label: "Total events", value: String(summary?.totalEvents ?? 0), icon: CalendarRange, tone: "bg-blue-100 text-blue-700" },
    { label: "Upcoming events", value: String(summary?.upcomingEvents ?? 0), icon: CalendarCheck2, tone: "bg-emerald-100 text-emerald-700" },
    { label: "Need review", value: String(summary?.pendingTransactions ?? 0), icon: Clock3, tone: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">Performance report</p>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-[#211333]">Overview</h2>
          <p className="mt-1 text-sm text-zinc-500">Accepted transactions are reflected in revenue and ticket sales.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-purple-100 bg-white p-2">
          <div className="flex rounded-xl bg-purple-50 p-1">
            {(["day", "month", "year"] as StatisticPeriod[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onPeriodChange(item)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition ${period === item ? "bg-white text-purple-700 shadow-sm" : "text-zinc-500 hover:text-purple-700"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            className="h-9 rounded-xl border border-purple-100 px-3 text-sm text-zinc-700 outline-none focus:border-purple-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm shadow-purple-100/50">
            <div className={`mb-5 flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
            <p className="mt-1 truncate text-2xl font-bold text-[#211333]" title={value}>{value}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center rounded-3xl bg-white text-purple-700">
          <LoaderCircle className="mr-2 size-5 animate-spin" /> Loading statistics...
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          <section className="rounded-3xl border border-purple-100 bg-white p-5 xl:col-span-2">
            <div className="mb-5">
              <h3 className="font-heading text-xl font-semibold text-[#211333]">Revenue trend</h3>
              <p className="text-sm text-zinc-500">Revenue grouped by selected {period}.</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.series ?? []} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eee7f8" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 11 }} minTickGap={20} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(value: number) => formatIDR(value)} width={72} />
                  <Tooltip formatter={(value) => [formatFullIDR(Number(value)), "Revenue"]} contentStyle={{ borderRadius: 12, borderColor: "#e9ddff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fill="url(#revenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-3xl border border-purple-100 bg-white p-5">
            <div className="mb-5">
              <h3 className="font-heading text-xl font-semibold text-[#211333]">Tickets sold</h3>
              <p className="text-sm text-zinc-500">Volume by selected {period}.</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.series ?? []}>
                  <CartesianGrid vertical={false} stroke="#eee7f8" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 11 }} minTickGap={20} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 11 }} width={32} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e9ddff" }} />
                  <Bar dataKey="tickets" name="Tickets" fill="#fb923c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-purple-100 bg-white p-5">
          <h3 className="font-heading text-xl font-semibold text-[#211333]">Top events</h3>
          <div className="mt-4 space-y-3">
            {data?.topEvents.length ? data.topEvents.map((event, index) => (
              <div key={event.eventId} className="flex items-center gap-3 rounded-2xl bg-purple-50/70 p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-purple-700">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#211333]">{event.eventName}</p>
                  <p className="text-xs text-zinc-500">{event.tickets} tickets</p>
                </div>
                <span className="text-sm font-bold text-purple-700">{formatFullIDR(event.revenue)}</span>
              </div>
            )) : <p className="py-8 text-center text-sm text-zinc-500">No accepted transactions in this period.</p>}
          </div>
        </section>
        <section className="rounded-3xl border border-purple-100 bg-white p-5">
          <h3 className="font-heading text-xl font-semibold text-[#211333]">Transaction status</h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Awaiting payment", "WAITING_FOR_PAYMENT"],
              ["Need review", "WAITING_FOR_ADMIN_CONFIRMATION"],
              ["Accepted", "DONE"],
              ["Rejected", "REJECTED"],
              ["Expired", "EXPIRED"],
              ["Canceled", "CANCELED"],
            ].map(([label, key]) => (
              <div key={key} className="rounded-2xl border border-purple-100 p-4">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#211333]">{data?.statusCounts[key as keyof OrganizerDashboardData["statusCounts"]] ?? 0}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatisticsPanel;
