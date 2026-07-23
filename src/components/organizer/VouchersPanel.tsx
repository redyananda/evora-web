import { useState } from "react";
import { CalendarClock, LoaderCircle, Plus, Tag, TicketPercent, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  useDeleteVoucher,
  useOrganizerEvents,
  useOrganizerVouchers,
} from "@/hooks/api/organizer/useOrganizer";
import type { OrganizerVoucher } from "@/types/organizer";
import VoucherFormModal from "./VoucherFormModal";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const VouchersPanel = () => {
  const [eventFilter, setEventFilter] = useState<number | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<OrganizerVoucher | null>(null);

  const { data: eventsData } = useOrganizerEvents(1, "", 50);
  const events = eventsData?.data ?? [];
  const { data: vouchers, isLoading } = useOrganizerVouchers(
    eventFilter === "all" ? undefined : eventFilter
  );
  const deleteVoucher = useDeleteVoucher();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">Promotions</p>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-[#211333]">Event vouchers</h2>
          <p className="mt-1 text-sm text-zinc-500">Create limited-time discount codes attendees can redeem at checkout.</p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm(true)}
          disabled={events.length === 0}
          className="rounded-xl bg-[#6d28d9] px-5 text-white hover:bg-[#5b21b6] disabled:opacity-50"
        >
          <Plus className="size-4" /> New voucher
        </Button>
      </div>

      <div className="flex max-w-xs flex-col gap-1">
        <label htmlFor="voucher-event-filter" className="text-xs font-semibold text-zinc-500">Filter by event</label>
        <select
          id="voucher-event-filter"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="h-11 w-full rounded-xl border border-purple-100 bg-white px-3 text-sm outline-none focus:border-purple-500"
        >
          <option value="all">All events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.eventName}</option>
          ))}
        </select>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-purple-200 bg-white py-16 text-center">
          <TicketPercent className="mx-auto size-10 text-purple-300" />
          <h3 className="mt-4 font-heading text-xl font-semibold text-[#211333]">Create an event first</h3>
          <p className="mt-1 text-sm text-zinc-500">Vouchers are attached to an event, so you need at least one event to run a promotion.</p>
        </div>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl bg-white text-purple-700"><LoaderCircle className="mr-2 size-5 animate-spin" /> Loading vouchers...</div>
      ) : vouchers?.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {vouchers.map((voucher) => {
            const soldOut = voucher.availableVoucher <= 0;
            const status = soldOut
              ? { label: "Fully claimed", className: "bg-zinc-100 text-zinc-500" }
              : voucher.isActive
                ? { label: "Active", className: "bg-green-100 text-green-700" }
                : { label: "Scheduled / ended", className: "bg-orange-100 text-orange-700" };
            return (
              <article key={voucher.id} className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700"><Tag className="size-4" /></span>
                      <span className="font-heading text-xl font-semibold tracking-wide text-[#211333]">{voucher.code}</span>
                    </div>
                    <p className="mt-2 truncate text-sm text-zinc-500">{voucher.event.eventName}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}>{status.label}</span>
                    <button
                      type="button"
                      onClick={() => setVoucherToDelete(voucher)}
                      disabled={deleteVoucher.isPending}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete voucher"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-purple-50 p-3 text-center">
                  <div><p className="text-[11px] text-zinc-500">Discount</p><p className="truncate text-sm font-bold text-purple-700" title={formatIDR(voucher.discount)}>{formatIDR(voucher.discount)}</p></div>
                  <div><p className="text-[11px] text-zinc-500">Remaining</p><p className="font-bold text-[#211333]">{voucher.availableVoucher}</p></div>
                  <div><p className="text-[11px] text-zinc-500">Claimed</p><p className="font-bold text-[#211333]">{voucher.claimedCount} / {voucher.total}</p></div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-zinc-500">
                  <p className="flex items-center gap-2"><CalendarClock className="size-4 text-purple-600" /> {formatDate(voucher.startDate)}</p>
                  <p className="flex items-center gap-2"><CalendarClock className="size-4 text-purple-600" /> {formatDate(voucher.endDate)}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-purple-200 bg-white py-16 text-center">
          <TicketPercent className="mx-auto size-10 text-purple-300" />
          <h3 className="mt-4 font-heading text-xl font-semibold text-[#211333]">No vouchers yet</h3>
          <p className="mt-1 text-sm text-zinc-500">Use “New voucher” to launch your first promotion for this event.</p>
        </div>
      )}

      {showForm && (
        <VoucherFormModal
          events={events}
          defaultEventId={eventFilter === "all" ? undefined : eventFilter}
          onClose={() => setShowForm(false)}
        />
      )}
      <ConfirmDialog
        open={Boolean(voucherToDelete)}
        title="Delete this voucher?"
        description={`Voucher “${voucherToDelete?.code ?? ""}” will be permanently removed. Vouchers that have already been used cannot be deleted.`}
        confirmLabel="Delete voucher"
        tone="danger"
        isPending={deleteVoucher.isPending}
        onCancel={() => setVoucherToDelete(null)}
        onConfirm={() => {
          if (!voucherToDelete) return;
          deleteVoucher.mutate(voucherToDelete.id, {
            onSuccess: () => setVoucherToDelete(null),
          });
        }}
      />
    </div>
  );
};

export default VouchersPanel;
