import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import {
  Ban,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Copy,
  FileUp,
  Headset,
  Hourglass,
  Loader2,
  MapPin,
  Ticket,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";
import useGetTransaction from "@/hooks/api/transaction/useGetTransaction";
import { useUploadPaymentProof } from "@/hooks/api/transaction/useUploadPaymentProof";
import type { TransactionStatus } from "@/types/organizer";

const TAX_RATE = 0.11;
const RESERVATION_MINUTES = 120; 
const CONFIRMATION_MINUTES = 3 * 24 * 60; 
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const TRANSFER_DETAILS = {
  bankName: "Evora Global Bank",
  accountNumber: "8820 – 4519 – 0023",
};

type StatusBadge = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const STATUS_BADGE: Record<TransactionStatus, StatusBadge> = {
  WAITING_FOR_PAYMENT: {
    label: "Waiting for Payment",
    icon: Clock,
    className: "bg-[#d9f99d] text-[#3f6212]",
  },
  WAITING_FOR_ADMIN_CONFIRMATION: {
    label: "Waiting for Admin Confirmation",
    icon: Hourglass,
    className: "bg-[#fef3c7] text-[#92400e]",
  },
  DONE: {
    label: "Payment Confirmed",
    icon: CircleCheck,
    className: "bg-[#d1fae5] text-[#065f46]",
  },
  REJECTED: {
    label: "Payment Rejected",
    icon: CircleX,
    className: "bg-[#fee2e2] text-[#991b1b]",
  },
  EXPIRED: {
    label: "Reservation Expired",
    icon: CircleAlert,
    className: "bg-[#f4f4f5] text-[#52525b]",
  },
  CANCELED: {
    label: "Reservation Canceled",
    icon: Ban,
    className: "bg-[#f4f4f5] text-[#52525b]",
  },
};

type PaymentState = {
  total?: number;
  quantity?: number;
  attendee?: { firstName: string; lastName: string; email: string };
};

const formatIDR = (value: number) =>
  value <= 0 ? "Free" : `IDR ${value.toLocaleString("id-ID")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const formatClock = (seconds: number) => {
  const clamped = Math.max(0, seconds);
  const h = String(Math.floor(clamped / 3600)).padStart(2, "0");
  const m = String(Math.floor((clamped % 3600) / 60)).padStart(2, "0");
  const s = String(clamped % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const Payment = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = (location.state ?? {}) as PaymentState;
  const { data: event, isPending, isError } = useGetEventBySlug(slug ?? "");

  const txnId = Number(searchParams.get("txn")) || null;
  const { data: transaction } = useGetTransaction(txnId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: uploadProof, isPending: isSubmitting } =
    useUploadPaymentProof();

  const quantity = Math.max(1, transaction?.quantity ?? state.quantity ?? 1);

  const awaitingConfirmation =
    transaction?.status === "WAITING_FOR_ADMIN_CONFIRMATION";

  const expiresAt = transaction
    ? new Date(
        (awaitingConfirmation && transaction.confirmationDeadline
          ? transaction.confirmationDeadline
          : transaction.paymentDeadline),
      ).getTime()
    : null;

  const windowSeconds =
    (awaitingConfirmation ? CONFIRMATION_MINUTES : RESERVATION_MINUTES) * 60;

  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_MINUTES * 60);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () =>
      setSecondsLeft(Math.round((expiresAt - Date.now()) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const total = useMemo(() => {
    if (typeof transaction?.finalPrice === "number") return transaction.finalPrice;
    if (typeof state.total === "number") return state.total;
    const subtotal = (event?.price ?? 0) * quantity;
    return subtotal + Math.round(subtotal * TAX_RATE);
  }, [transaction?.finalPrice, state.total, event?.price, quantity]);

  const alreadySubmitted =
    Boolean(transaction?.paymentProof) ||
    transaction?.status === "WAITING_FOR_ADMIN_CONFIRMATION";

  const expired = secondsLeft <= 0;


  const effectiveStatus: TransactionStatus =
    (transaction?.status as TransactionStatus | undefined) ??
    (alreadySubmitted
      ? "WAITING_FOR_ADMIN_CONFIRMATION"
      : expired
        ? "EXPIRED"
        : "WAITING_FOR_PAYMENT");
  const statusBadge = STATUS_BADGE[effectiveStatus] ?? STATUS_BADGE.WAITING_FOR_PAYMENT;
  const StatusIcon = statusBadge.icon;


  const isConfirmed = effectiveStatus === "DONE";


  const isRejected = effectiveStatus === "REJECTED";

  const progress = Math.max(
    0,
    Math.min(100, (secondsLeft / windowSeconds) * 100),
  );

  const expiryLabel = expiresAt
    ? new Date(expiresAt).toLocaleString("en-US", {
        ...(awaitingConfirmation ? { month: "short", day: "numeric" } : {}),
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value.replaceAll(/[^\d]/g, ""));
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const acceptFile = (selected: File | null | undefined) => {
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.error("Please upload a JPG, PNG, or PDF file");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("File is too large (max 5MB)");
      return;
    }
    setFile(selected);
  };

  const handleSubmit = () => {
    if (expired) {
      toast.error("Your reservation has expired");
      return;
    }
    if (!txnId) {
      toast.error("We couldn't identify your order");
      return;
    }
    if (!file) {
      toast.error("Please upload your payment receipt first");
      return;
    }
    uploadProof({ transactionId: txnId, proof: file });
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f3edff]">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="size-10 animate-spin rounded-full border-4 border-[#e4d9ff] border-t-[#6d28d9]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[#f3edff]">
        <Navbar />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-[#1e1b2e]">
            Reservation not found
          </h1>
          <p className="text-[15px] text-[#52525b]">
            We couldn't find the order you're trying to pay for.
          </p>
          <Link to="/#discover">
            <Button className="rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
              Back to events
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3edff]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-12">
        {/* Header */}
        <header className="text-center">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${statusBadge.className}`}
          >
            <StatusIcon className="size-4" />
            {statusBadge.label}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-[#1e1b2e] sm:text-5xl">
            {isConfirmed
              ? "You're All Set"
              : isRejected
                ? "Purchase Not Approved"
                : "Secure Your Spot"}
          </h1>
          {!isRejected && (
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#52525b]">
              {isConfirmed
                ? "Your registration is confirmed and your ticket is ready. We've saved your spot for this event."
                : awaitingConfirmation
                  ? "We've received your receipt. The organizer has up to 3 days to review and confirm your payment."
                  : "Please complete your payment and upload the receipt before the timer expires to confirm your attendance."}
            </p>
          )}
        </header>

        {isRejected ? (
          /* Rejected order — a plain message, no timer / upload / transfer. */
          <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl bg-white p-10 text-center shadow-sm">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#fee2e2]">
              <CircleX className="size-8 text-[#dc2626]" />
            </span>
            <h2 className="font-heading text-2xl font-bold text-[#1e1b2e]">
              Your ticket purchase was rejected
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-[#52525b]">
              Sorry, your ticket purchase was rejected. If you believe this is a
              mistake, please contact the event organizer.
            </p>
            <Link to="/#discover">
              <Button className="mt-1 rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
                Back to events
              </Button>
            </Link>
          </div>
        ) : (
        <>
        {/* Timer + event summary */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Time remaining — or a confirmation panel for a resolved order */}
          {isConfirmed ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm lg:col-span-2">
              <span className="flex size-16 items-center justify-center rounded-full bg-[#d1fae5]">
                <CircleCheck className="size-8 text-[#059669]" />
              </span>
              <p className="mt-4 font-heading text-2xl font-bold text-[#1e1b2e]">
                Ticket Confirmed
              </p>
              <p className="mt-2 text-sm text-[#52525b]">
                No payment needed. Your{" "}
                {quantity > 1 ? "tickets are" : "ticket is"} ready to go.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa]">
                Time Remaining
              </p>
              <p
                className={`mt-3 font-heading text-5xl font-bold tabular-nums ${
                  expired ? "text-red-500" : "text-[#6d28d9]"
                }`}
              >
                {formatClock(secondsLeft)}
              </p>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#efe7ff]">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    expired ? "bg-red-400" : "bg-[#6d28d9]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-xs text-[#71717a]">
                {expired
                  ? awaitingConfirmation
                    ? "Confirmation window closed"
                    : "Reservation expired"
                  : awaitingConfirmation
                    ? `Confirmation expires ${expiryLabel}`
                    : `Reservation expires at ${expiryLabel}`}
              </p>
            </div>
          )}

          {/* Event summary */}
          <div className="flex items-start gap-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <img
              src={event.thumbnail}
              alt={event.eventName}
              className="hidden size-32 shrink-0 rounded-xl object-cover sm:block"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-xl font-bold leading-snug text-[#1e1b2e]">
                  {event.eventName}
                </h2>
                <span className="whitespace-nowrap font-heading text-xl font-bold text-[#6d28d9]">
                  {formatIDR(total)}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-[#52525b]">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-[#6d28d9]" />
                  {formatDate(event.startDate)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-[#6d28d9]" />
                  {event.venue}, {event.location}
                </span>
                <span className="flex items-center gap-2">
                  <Ticket className="size-4 shrink-0 text-[#6d28d9]" />
                  {quantity}× General Admission{" "}
                  {quantity > 1 ? "Tickets" : "Ticket"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmed order — nothing left to do */}
        {isConfirmed && (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
              Your spot is reserved
            </h2>
            <p className="max-w-md text-[15px] text-[#52525b]">
              A confirmation has been recorded for this order. Show up on the event
              day. No receipt or transfer is required.
            </p>
            <Link to="/#discover">
              <Button className="rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
                Browse more events
              </Button>
            </Link>
          </div>
        )}

        {/* Upload + transfer details */}
        {!isConfirmed && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Proof of payment */}
          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
              Proof of Payment
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />

            {alreadySubmitted ? (
              /* Proof already sent — locked, no remove/swap. */
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#c7f0d8] bg-[#f0fdf4] p-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#dcfce7]">
                  <CircleCheck className="size-5 text-[#16a34a]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1e1b2e]">
                    {file?.name ?? "Payment receipt uploaded"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#16a34a]">
                    Uploaded, waiting for confirmation
                  </p>
                </div>
              </div>
            ) : file ? (
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#e4d9ff] bg-[#faf7ff] p-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#ede4ff]">
                  <FileUp className="size-5 text-[#6d28d9]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1e1b2e]">
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#71717a]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="flex size-8 items-center justify-center rounded-full text-[#71717a] transition-colors hover:bg-[#f3edff] hover:text-[#6d28d9]"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  acceptFile(e.dataTransfer.files?.[0]);
                }}
                className={`mt-5 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                  isDragging
                    ? "border-[#6d28d9] bg-[#f3edff]"
                    : "border-[#c9b8f5] bg-white hover:bg-[#faf7ff]"
                }`}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-[#ede4ff]">
                  <FileUp className="size-6 text-[#6d28d9]" />
                </span>
                <p className="mt-4 text-sm font-semibold text-[#1e1b2e]">
                  Drag and drop or click to upload
                </p>
                <p className="mt-1 text-xs text-[#a1a1aa]">
                  JPG, PNG, or PDF (Max 5MB)
                </p>
              </button>
            )}
          </section>

          {/* Transfer details */}
          <section className="flex flex-col rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
              Transfer Details
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              <DetailRow
                accent="#f97316"
                label="Bank Name"
                value={TRANSFER_DETAILS.bankName}
                onCopy={() =>
                  handleCopy(TRANSFER_DETAILS.bankName, "Bank name")
                }
              />
              <DetailRow
                accent="#6d28d9"
                label="Account Number"
                value={TRANSFER_DETAILS.accountNumber}
                onCopy={() =>
                  handleCopy(TRANSFER_DETAILS.accountNumber, "Account number")
                }
              />
              <DetailRow
                accent="#84cc16"
                label="Amount to Transfer"
                value={formatIDR(total)}
                emphasize
                onCopy={() => handleCopy(String(total), "Amount")}
              />
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={expired || isSubmitting || alreadySubmitted}
              className="mt-6 h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white shadow-sm hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : alreadySubmitted ? (
                "Waiting for Confirmation"
              ) : expired ? (
                "Reservation Expired"
              ) : (
                "Submit Receipt"
              )}
            </Button>
          </section>
        </div>
        )}

        {/* Support banner */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#e9e3f7] p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
              <Headset className="size-5 text-[#6d28d9]" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-[#1e1b2e]">
                Need help with your payment?
              </h3>
              <p className="mt-0.5 text-sm text-[#52525b]">
                Our support team is available 24/7 to assist you.
              </p>
            </div>
          </div>
          <Button
            type="button"
            className="h-11 shrink-0 rounded-full border border-[#6d28d9] bg-transparent px-6 text-sm font-semibold text-[#6d28d9] shadow-none hover:bg-[#6d28d9] hover:text-white"
          >
            Contact Support
          </Button>
        </div>
        </>
        )}
      </main>

      <Footer />
    </div>
  );
};

type DetailRowProps = {
  accent: string;
  label: string;
  value: string;
  emphasize?: boolean;
  onCopy: () => void;
};

const DetailRow = ({
  accent,
  label,
  value,
  emphasize,
  onCopy,
}: DetailRowProps) => (
  <div className="flex items-center justify-between gap-3 overflow-hidden rounded-xl bg-[#faf7ff] p-4">
    <span
      className="-my-4 -ml-4 mr-1 self-stretch rounded-l-xl"
      style={{ width: 4, backgroundColor: accent }}
    />
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate font-semibold ${
          emphasize ? "text-lg text-[#6d28d9]" : "text-sm text-[#1e1b2e]"
        }`}
      >
        {value}
      </p>
    </div>
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={onCopy}
      className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#71717a] transition-colors hover:bg-[#f3edff] hover:text-[#6d28d9]"
    >
      <Copy className="size-4" />
    </button>
  </div>
);

export default Payment;
