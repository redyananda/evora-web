import { useState, type FormEvent } from "react";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateVoucher } from "@/hooks/api/organizer/useOrganizer";
import type { OrganizerEvent } from "@/types/organizer";

interface VoucherFormModalProps {
  events: OrganizerEvent[];
  defaultEventId?: number;
  onClose: () => void;
}

const VoucherFormModal = ({ events, defaultEventId, onClose }: VoucherFormModalProps) => {
  const createVoucher = useCreateVoucher();
  const [form, setForm] = useState(() => ({
    eventId: defaultEventId ?? events[0]?.id ?? 0,
    code: "",
    discount: 25000,
    total: 100,
    startDate: "",
    endDate: "",
  }));

  const change = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.eventId) return;
    createVoucher.mutate(
      {
        eventId: form.eventId,
        code: form.code.trim().toUpperCase(),
        discount: Number(form.discount),
        total: Number(form.total),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d102d]/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-100 bg-white px-6 py-5">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-[#211333]">New voucher promotion</h2>
            <p className="mt-1 text-sm text-zinc-500">Give attendees a limited-time discount for one of your events.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-zinc-500 hover:bg-purple-50 hover:text-purple-700" aria-label="Close form">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-5 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="eventId" className="mb-2">Event</Label>
            <select
              id="eventId"
              value={form.eventId}
              onChange={(e) => change("eventId", Number(e.target.value))}
              className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm outline-none focus:border-purple-500"
            >
              {events.length === 0 && <option value={0}>No events available</option>}
              {events.map((event) => (
                <option key={event.id} value={event.id}>{event.eventName}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="code" className="mb-2">Voucher code</Label>
            <Input
              id="code"
              required
              placeholder="e.g. EARLYBIRD"
              value={form.code}
              onChange={(e) => change("code", e.target.value.toUpperCase())}
              className="uppercase"
            />
            <p className="mt-1 text-xs text-zinc-400">Letters and numbers only, 3–24 characters.</p>
          </div>

          <div>
            <Label htmlFor="discount" className="mb-2">Discount amount (IDR)</Label>
            <Input id="discount" type="number" min={1} required value={form.discount} onChange={(e) => change("discount", Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="total" className="mb-2">Quantity of vouchers</Label>
            <Input id="total" type="number" min={1} required value={form.total} onChange={(e) => change("total", Number(e.target.value))} />
          </div>

          <div>
            <Label htmlFor="startDate" className="mb-2">Starts at</Label>
            <Input id="startDate" type="datetime-local" required value={form.startDate} onChange={(e) => change("startDate", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="endDate" className="mb-2">Ends at</Label>
            <Input id="endDate" type="datetime-local" required value={form.endDate} onChange={(e) => change("endDate", e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 border-t border-purple-100 pt-5 sm:col-span-2">
            <Button type="button" onClick={onClose} className="rounded-xl border border-purple-200 bg-white px-5 text-purple-700 hover:bg-purple-50">Cancel</Button>
            <Button type="submit" disabled={createVoucher.isPending || !form.eventId} className="rounded-xl bg-[#6d28d9] px-5 text-white hover:bg-[#5b21b6] disabled:opacity-50">
              {createVoucher.isPending && <LoaderCircle className="size-4 animate-spin" />}
              Create voucher
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherFormModal;
