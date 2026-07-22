import { useState, type FormEvent } from "react";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useSaveOrganizerEvent } from "@/hooks/api/organizer/useOrganizer";
import type {
  EventCategory,
  EventFormPayload,
  OrganizerEvent,
} from "@/types/organizer";

interface EventFormModalProps {
  event?: OrganizerEvent | null;
  onClose: () => void;
}

const categories: Array<{ value: EventCategory; label: string }> = [
  { value: "MUSIC", label: "Music" },
  { value: "TECH_AND_INNOVATION", label: "Tech & Innovation" },
  { value: "FOOD_AND_DRINK", label: "Food & Drink" },
  { value: "ARTS_AND_CULTURE", label: "Arts & Culture" },
  { value: "BUSINESS", label: "Business" },
  { value: "WELLNESS", label: "Wellness" },
];

const initialForm: EventFormPayload = {
  eventName: "",
  description: "",
  category: "MUSIC",
  price: 0,
  venue: "",
  location: "",
  startDate: "",
  endDate: "",
  totalSeats: 1,
  thumbnail: null,
};

const toLocalInput = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const EventFormModal = ({ event, onClose }: EventFormModalProps) => {
  const [form, setForm] = useState<EventFormPayload>(() =>
    event
      ? {
          eventName: event.eventName,
          description: event.description,
          category: event.category,
          price: event.price,
          venue: event.venue,
          location: event.location,
          startDate: toLocalInput(event.startDate),
          endDate: toLocalInput(event.endDate),
          totalSeats: event.totalSeats,
          thumbnail: event.thumbnail,
        }
      : initialForm
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const saveEvent = useSaveOrganizerEvent();

  const change = <K extends keyof EventFormPayload>(key: K, value: EventFormPayload[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (submitEvent: FormEvent) => {
    submitEvent.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSave = () => {
    saveEvent.mutate(
      {
        id: event?.id,
        payload: {
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          thumbnail: form.thumbnail?.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d102d]/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-100 bg-white px-6 py-5">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-[#211333]">
              {event ? "Edit event" : "Create a new event"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Keep the event information accurate for attendees.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-zinc-500 hover:bg-purple-50 hover:text-purple-700" aria-label="Close form">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-5 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="eventName" className="mb-2">Event name</Label>
            <Input id="eventName" required value={form.eventName} onChange={(e) => change("eventName", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description" className="mb-2">Description</Label>
            <Textarea id="description" required rows={5} value={form.description} onChange={(e) => change("description", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category" className="mb-2">Category</Label>
            <select id="category" value={form.category} onChange={(e) => change("category", e.target.value as EventCategory)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm outline-none focus:border-purple-500">
              {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="price" className="mb-2">Ticket price (IDR)</Label>
            <Input id="price" type="number" min={0} required value={form.price} onChange={(e) => change("price", Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="venue" className="mb-2">Venue</Label>
            <Input id="venue" required value={form.venue} onChange={(e) => change("venue", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="location" className="mb-2">City / location</Label>
            <Input id="location" required value={form.location} onChange={(e) => change("location", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="startDate" className="mb-2">Starts at</Label>
            <Input id="startDate" type="datetime-local" required value={form.startDate} onChange={(e) => change("startDate", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="endDate" className="mb-2">Ends at</Label>
            <Input id="endDate" type="datetime-local" required value={form.endDate} onChange={(e) => change("endDate", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="totalSeats" className="mb-2">Total seats</Label>
            <Input id="totalSeats" type="number" min={1} required value={form.totalSeats} onChange={(e) => change("totalSeats", Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="thumbnail" className="mb-2">Thumbnail URL</Label>
            <Input id="thumbnail" type="url" placeholder="https://..." value={form.thumbnail ?? ""} onChange={(e) => change("thumbnail", e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 border-t border-purple-100 pt-5 sm:col-span-2">
            <Button type="button" onClick={onClose} className="rounded-xl border border-purple-200 bg-white px-5 text-purple-700 hover:bg-purple-50">Cancel</Button>
            <Button type="submit" disabled={saveEvent.isPending} className="rounded-xl bg-[#6d28d9] px-5 text-white hover:bg-[#5b21b6]">
              {saveEvent.isPending && <LoaderCircle className="size-4 animate-spin" />}
              {event ? "Save changes" : "Create event"}
            </Button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title={event ? "Save event changes?" : "Create this event?"}
        description={
          event
            ? `The updated information for “${form.eventName}” will be visible to attendees.`
            : `“${form.eventName}” will be added to your organizer event list.`
        }
        confirmLabel={event ? "Save changes" : "Create event"}
        isPending={saveEvent.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmSave}
      />
    </div>
  );
};

export default EventFormModal;
