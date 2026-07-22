import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import { useCreateEvent } from "@/hooks/api/event/useCreateEvent";

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; 

const CATEGORIES = [
  { value: "MUSIC", label: "Music" },
  { value: "TECH_AND_INNOVATION", label: "Tech & Innovation" },
  { value: "FOOD_AND_DRINK", label: "Food & Drink" },
  { value: "ARTS_AND_CULTURE", label: "Arts & Culture" },
  { value: "BUSINESS", label: "Business" },
  { value: "WELLNESS", label: "Wellness" },
];


const SectionCard = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-6 flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6d28d9]">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-[#18181b]">{title}</h2>
        <p className="text-sm text-[#71717a]">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const FieldHint = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-1.5 text-xs text-[#a1a1aa]">{children}</p>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1.5 text-xs text-red-600">{message}</p> : null;


const createEventSchema = z
  .object({
    eventName: z.string().min(1, "Nama event wajib diisi"),
    category: z.enum(
      CATEGORIES.map((c) => c.value) as [string, ...string[]],
      { message: "Kategori wajib dipilih" },
    ),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    thumbnail: z
      .instanceof(File, { message: "Thumbnail wajib diunggah" })
      .refine((file) => file.type.startsWith("image/"), "File harus berupa gambar")
      .refine((file) => file.size <= MAX_THUMBNAIL_SIZE, "Ukuran maksimal 2MB"),
    venue: z.string().min(1, "Venue wajib diisi"),
    location: z.string().min(1, "Kota wajib diisi"),
    startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
    price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
    totalSeats: z.coerce.number().int().min(1, "Jumlah kursi minimal 1"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

type CreateEventFormValues = z.input<typeof createEventSchema>;

const CreateEvent = () => {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending } = useCreateEvent();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
  });

  const onSubmit = (values: CreateEventFormValues) => {
    createEvent(
      {
        ...values,
        price: Number(values.price),
        totalSeats: Number(values.totalSeats),
        thumbnail: values.thumbnail as File,
      },
      { onSuccess: (res) => navigate(`/events/${res.data.slug}`) },
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f1ff]">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#71717a] hover:text-[#6d28d9]"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <h1 className="font-heading text-3xl font-bold text-[#18181b] sm:text-4xl">
            Create New Event
          </h1>
          <p className="mt-2 text-sm text-[#71717a]">
            Fill in the details below so attendees know exactly what to expect
            from your event.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── Basic info ──────────────────────────────────────────── */}
          <SectionCard
            icon={<Info className="size-4.5" />}
            title="Basic Information"
            subtitle="Your event's name, category, and description."
          >
            <div className="space-y-5">
              <div>
                <Label htmlFor="eventName" className="mb-1.5 block text-sm font-medium">
                  Event Name
                </Label>
                <Input
                  id="eventName"
                  placeholder="e.g. Sunrise Yoga & Breathwork Festival"
                  {...register("eventName")}
                />
                <FieldError message={errors.eventName?.message} />
              </div>

              <div>
                <Label htmlFor="category" className="mb-1.5 block text-sm font-medium">
                  Category
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Select an event category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.category?.message} />
              </div>

              <div>
                <Label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Tell people about your event: the lineup, the speakers, and what attendees will walk away with."
                  {...register("description")}
                />
                <FieldError message={errors.description?.message} />
                <FieldHint>
                  Write at least 100 characters to make your description compelling.
                </FieldHint>
              </div>
            </div>
          </SectionCard>

          {/* ── Thumbnail ────────────────────────────────────────────────── */}
          <SectionCard
            icon={<ImagePlus className="size-4.5" />}
            title="Thumbnail"
            subtitle="The main image shown on search and listing pages."
          >
            <label
              htmlFor="thumbnail"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e4e4e7] bg-[#fafafa] px-6 py-10 text-center transition-colors hover:border-[#6d28d9] hover:bg-[#faf5ff]"
            >
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="mb-3 max-h-56 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f3e8ff] text-[#6d28d9]">
                  <ImagePlus className="size-5" />
                </div>
              )}
              <span className="text-sm font-medium text-[#18181b]">
                {thumbnailPreview ? "Change image" : "Click to upload an image"}
              </span>
              <span className="mt-1 text-xs text-[#a1a1aa]">
                PNG, JPG, or WEBP, 2MB max (16:9 ratio)
              </span>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setValue("thumbnail", file, { shouldValidate: true });
                  setThumbnailPreview(URL.createObjectURL(file));
                }}
              />
            </label>
            <FieldError message={errors.thumbnail?.message} />
          </SectionCard>

          {/* ── Location & schedule ───────────────────────────────────────────── */}
          <SectionCard
            icon={<MapPin className="size-4.5" />}
            title="Location & Schedule"
            subtitle="Where your event takes place and when it runs."
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="venue" className="mb-1.5 block text-sm font-medium">
                    Venue
                  </Label>
                  <Input
                    id="venue"
                    placeholder="e.g. Pandawa Beach"
                    {...register("venue")}
                  />
                  <FieldError message={errors.venue?.message} />
                </div>
                <div>
                  <Label htmlFor="location" className="mb-1.5 block text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Bali"
                    {...register("location")}
                  />
                  <FieldError message={errors.location?.message} />
                </div>
              </div>

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="startDate" className="mb-1.5 block text-sm font-medium">
                    <CalendarDays className="mr-1 inline size-3.5 text-[#71717a]" />
                    Start Date & Time
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    {...register("startDate")}
                  />
                  <FieldError message={errors.startDate?.message} />
                </div>
                <div>
                  <Label htmlFor="endDate" className="mb-1.5 block text-sm font-medium">
                    <CalendarDays className="mr-1 inline size-3.5 text-[#71717a]" />
                    End Date & Time
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    {...register("endDate")}
                  />
                  <FieldError message={errors.endDate?.message} />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Tickets ────────────────────────────────────────────────────── */}
          <SectionCard
            icon={<Ticket className="size-4.5" />}
            title="Tickets & Capacity"
            subtitle="Ticket pricing and how many seats you are offering."
          >
            <div className="space-y-5">
              <div>
                <Label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                  Ticket Price
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717a]">
                    Rp
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    placeholder="0"
                    className="pl-10"
                    {...register("price")}
                  />
                </div>
                <FieldError message={errors.price?.message} />
                <FieldHint>Enter 0 if this event is free.</FieldHint>
              </div>

              <div>
                <Label htmlFor="totalSeats" className="mb-1.5 block text-sm font-medium">
                  Total Seats
                </Label>
                <Input
                  id="totalSeats"
                  type="number"
                  min={1}
                  placeholder="e.g. 500"
                  {...register("totalSeats")}
                />
                <FieldError message={errors.totalSeats?.message} />
                <FieldHint>
                  Available seats start out matching this number.
                </FieldHint>
              </div>
            </div>
          </SectionCard>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => navigate(-1)}
              className="rounded-xl border-[#e4e4e7] bg-white py-5 text-[15px] font-semibold text-[#52525b] hover:bg-[#fafafa] sm:w-40"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#6d28d9] py-5 text-[15px] font-semibold text-white hover:bg-[#5b21b6] sm:w-48"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Event"
              )}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
