import { LoaderCircle, TicketCheck, UserRoundCheck, Users } from "lucide-react";
import { useState } from "react";
import {
  useEventParticipants,
  useOrganizerEvents,
} from "@/hooks/api/organizer/useOrganizer";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const ParticipantsPanel = () => {
  const { data: events, isLoading: isLoadingEvents } = useOrganizerEvents(1, "", 50);
  const [selectedEventId, setSelectedEventId] = useState<number>();
  const eventId = selectedEventId ?? events?.data[0]?.id;
  const { data, isLoading } = useEventParticipants(eventId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">Attendee report</p>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-[#211333]">Participants</h2>
          <p className="mt-1 text-sm text-zinc-500">Only participants from accepted transactions are displayed.</p>
        </div>
        <select disabled={isLoadingEvents || !events?.data.length} value={eventId ?? ""} onChange={(event) => setSelectedEventId(Number(event.target.value))} className="h-11 min-w-72 max-w-full rounded-xl border border-purple-100 bg-white px-3 text-sm outline-none focus:border-purple-400 disabled:opacity-50">
          {!events?.data.length && <option value="">No events available</option>}
          {events?.data.map((event) => <option key={event.id} value={event.id}>{event.eventName}</option>)}
        </select>
      </div>

      {data && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Unique participants", value: data.summary.participantCount.toLocaleString("id-ID"), icon: Users },
            { label: "Total tickets", value: data.summary.tickets.toLocaleString("id-ID"), icon: TicketCheck },
            { label: "Revenue collected", value: formatIDR(data.summary.revenue), icon: UserRoundCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-purple-100 bg-white p-5"><Icon className="mb-4 size-6 text-purple-700" /><p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p><p className="mt-1 text-2xl font-bold text-[#211333]">{value}</p></div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white">
        {isLoading || isLoadingEvents ? (
          <div className="flex h-64 items-center justify-center text-purple-700"><LoaderCircle className="mr-2 size-5 animate-spin" /> Loading participants...</div>
        ) : data?.data.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-purple-50 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="px-5 py-4">Participant</th><th className="px-5 py-4">Transaction</th><th className="px-5 py-4">Tickets</th><th className="px-5 py-4">Total paid</th><th className="px-5 py-4">Confirmed at</th></tr></thead>
              <tbody className="divide-y divide-purple-50">
                {data.data.map((participant) => (
                  <tr key={participant.transactionId} className="hover:bg-purple-50/40"><td className="px-5 py-4"><p className="font-semibold text-[#211333]">{participant.name}</p><p className="text-xs text-zinc-500">{participant.email}</p></td><td className="px-5 py-4 font-semibold text-purple-700">#{participant.transactionId}</td><td className="px-5 py-4">{participant.quantity}</td><td className="px-5 py-4 font-semibold">{formatIDR(participant.totalPaid)}</td><td className="px-5 py-4 text-zinc-500">{formatDate(participant.paidAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-zinc-500"><Users className="mb-3 size-10 text-purple-300" /><p className="font-semibold text-[#211333]">No participants yet</p><p className="mt-1 text-sm">Accepted transactions for this event will appear here.</p></div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPanel;
