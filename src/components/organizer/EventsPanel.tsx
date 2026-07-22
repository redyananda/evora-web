import { useState } from "react";
import { CalendarDays, Edit3, LoaderCircle, MapPin, Plus, Search, Trash2, Users } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  useDeleteOrganizerEvent,
  useOrganizerEvents,
} from "@/hooks/api/organizer/useOrganizer";
import type { OrganizerEvent } from "@/types/organizer";
import EventFormModal from "./EventFormModal";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const EventsPanel = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<{ open: boolean; event: OrganizerEvent | null }>({ open: false, event: null });
  const [eventToDelete, setEventToDelete] = useState<OrganizerEvent | null>(null);
  const { data, isLoading } = useOrganizerEvents(page, search);
  const deleteEvent = useDeleteOrganizerEvent();
  const pages = Math.max(1, Math.ceil((data?.meta.total ?? 0) / (data?.meta.take ?? 10)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">Event management</p>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-[#211333]">Your events</h2>
          <p className="mt-1 text-sm text-zinc-500">Create, edit, review sales, and manage event capacity.</p>
        </div>
        <Button onClick={() => setEditor({ open: true, event: null })} className="h-11 rounded-xl bg-[#6d28d9] px-5 text-white hover:bg-[#5b21b6]"><Plus className="size-4" /> Create event</Button>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} className="flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search event or location" className="h-11 rounded-xl border-purple-100 bg-white pl-10" />
        </div>
        <Button type="submit" className="h-11 rounded-xl bg-white px-5 text-purple-700 shadow-sm hover:bg-purple-50">Search</Button>
      </form>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl bg-white text-purple-700"><LoaderCircle className="mr-2 size-5 animate-spin" /> Loading events...</div>
      ) : data?.data.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.data.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row">
                <img src={event.thumbnail || "/thumbnailEvent.webp"} alt={event.eventName} className="h-48 w-full object-cover sm:h-auto sm:w-44" />
                <div className="min-w-0 flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700">{event.category.replaceAll("_", " ")}</span>
                      <h3 className="mt-3 truncate font-heading text-xl font-semibold text-[#211333]">{event.eventName}</h3>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button type="button" onClick={() => setEditor({ open: true, event })} className="rounded-lg p-2 text-purple-700 hover:bg-purple-50" aria-label="Edit event"><Edit3 className="size-4" /></button>
                      <button type="button" onClick={() => setEventToDelete(event)} disabled={deleteEvent.isPending} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label="Delete event"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-zinc-500">
                    <p className="flex items-center gap-2"><CalendarDays className="size-4 text-purple-600" /> {formatDate(event.startDate)}</p>
                    <p className="flex items-center gap-2"><MapPin className="size-4 text-purple-600" /> {event.venue}, {event.location}</p>
                    <p className="flex items-center gap-2"><Users className="size-4 text-purple-600" /> {event.availableSeats} of {event.totalSeats} seats available</p>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-purple-50 p-3 text-center">
                    <div><p className="text-[11px] text-zinc-500">Sold</p><p className="font-bold text-[#211333]">{event.ticketsSold}</p></div>
                    <div><p className="text-[11px] text-zinc-500">Orders</p><p className="font-bold text-[#211333]">{event.transactionCount}</p></div>
                    <div><p className="text-[11px] text-zinc-500">Revenue</p><p className="truncate text-sm font-bold text-purple-700" title={formatIDR(event.revenue)}>{formatIDR(event.revenue)}</p></div>
                  </div>
                  <Link to={`/events/${event.slug}`} className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:underline">View public page →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-purple-200 bg-white py-16 text-center">
          <CalendarDays className="mx-auto size-10 text-purple-300" />
          <h3 className="mt-4 font-heading text-xl font-semibold text-[#211333]">No events found</h3>
          <p className="mt-1 text-sm text-zinc-500">Create your first event or change the search keyword.</p>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl bg-white text-purple-700 hover:bg-purple-50">Previous</Button>
          <span className="text-sm text-zinc-500">Page {page} of {pages}</span>
          <Button disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-xl bg-white text-purple-700 hover:bg-purple-50">Next</Button>
        </div>
      )}
      {editor.open && <EventFormModal event={editor.event} onClose={() => setEditor({ open: false, event: null })} />}
      <ConfirmDialog
        open={Boolean(eventToDelete)}
        title="Delete this event?"
        description={`“${eventToDelete?.eventName ?? "This event"}” will be permanently removed. Events that already have transactions cannot be deleted.`}
        confirmLabel="Delete event"
        tone="danger"
        isPending={deleteEvent.isPending}
        onCancel={() => setEventToDelete(null)}
        onConfirm={() => {
          if (!eventToDelete) return;
          deleteEvent.mutate(eventToDelete.id, {
            onSuccess: () => setEventToDelete(null),
          });
        }}
      />
    </div>
  );
};

export default EventsPanel;
