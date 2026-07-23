import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileUp,
  History,
  Loader2,
  MapPin,
  QrCode,
  ReceiptText,
  RefreshCw,
  TicketCheck,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import { Button } from "@/components/ui/button";
import useCustomerTransactions from "@/hooks/api/transaction/useCustomerTransactions";
import { useUploadPaymentProof } from "@/hooks/api/transaction/useUploadPaymentProof";
import { useAuthStore } from "@/store/auth.store";
import type { CustomerTransaction } from "@/types/customer";
import type { TransactionStatus } from "@/types/organizer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const STATUS_BADGES: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  WAITING_FOR_PAYMENT: {
    label: "Waiting for Payment",
    className: "bg-amber-100 text-amber-800",
  },
  WAITING_FOR_ADMIN_CONFIRMATION: {
    label: "Waiting for Confirmation",
    className: "bg-blue-100 text-blue-800",
  },
  DONE: {
    label: "Done",
    className: "bg-emerald-100 text-emerald-800",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-zinc-200 text-zinc-700",
  },
  CANCELED: {
    label: "Canceled",
    className: "bg-zinc-200 text-zinc-700",
  },
};

type DashboardView = "tickets" | "orders";
type TicketPeriod = "upcoming" | "past";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatEventDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));

const formatShortDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));

const getOrderCode = (id: number) => `EVR-${String(id).padStart(6, "0")}`;

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const badge = STATUS_BADGES[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof TicketCheck;
  title: string;
  description: string;
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8caef] bg-white px-6 text-center">
    <span className="flex size-14 items-center justify-center rounded-full bg-[#f3edff]">
      <Icon className="size-7 text-[#6d28d9]" />
    </span>
    <h3 className="mt-4 font-heading text-xl font-bold text-[#1e1b2e]">
      {title}
    </h3>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#71717a]">
      {description}
    </p>
    <Link
      to="/#discover"
      className="mt-5 rounded-xl bg-[#6d28d9] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5b21b6]"
    >
      Discover Events
    </Link>
  </div>
);

const Countdown = ({ deadline }: { deadline: string }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const deadlineTime = new Date(deadline).getTime();
    const tick = () =>
      setSecondsLeft(
        Math.max(0, Math.floor((deadlineTime - Date.now()) / 1000)),
      );
    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [deadline]);

  if (secondsLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
        <AlertCircle className="size-4" />
        Payment deadline has passed
      </span>
    );
  }

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
        Complete payment in
      </p>
      <p className="mt-1 font-mono text-lg font-bold tabular-nums text-amber-900">
        {hours}:{minutes}:{seconds}
      </p>
    </div>
  );
};

const UploadProofButton = ({
  transactionId,
  deadline,
}: {
  transactionId: number;
  deadline: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadProof, isPending } = useUploadPaymentProof();
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    const deadlineTime = new Date(deadline).getTime();
    const updateDeadlineState = () =>
      setDeadlinePassed(deadlineTime <= Date.now());
    updateDeadlineState();
    const intervalId = window.setInterval(updateDeadlineState, 1000);
    return () => window.clearInterval(intervalId);
  }, [deadline]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("File harus berupa JPG, PNG, atau PDF");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran file maksimal 5 MB");
      return;
    }

    uploadProof(
      { transactionId, proof: file },
      {
        onSettled: () => {
          if (inputRef.current) inputRef.current.value = "";
        },
      },
    );
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <Button
        type="button"
        disabled={isPending || deadlinePassed}
        onClick={() => inputRef.current?.click()}
        className="h-10 rounded-xl bg-[#6d28d9] px-4 text-sm font-semibold text-white hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <FileUp className="mr-2 size-4" />
        )}
        {isPending ? "Uploading..." : "Upload Payment Proof"}
      </Button>
    </>
  );
};

const TicketModal = ({
  ticket,
  onClose,
}: {
  ticket: CustomerTransaction;
  onClose: () => void;
}) => {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const ticketCode = getOrderCode(ticket.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1b2e]/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          aria-label="Close e-ticket"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-zinc-600 shadow-sm hover:text-[#6d28d9]"
        >
          <X className="size-5" />
        </button>

        <div className="bg-gradient-to-br from-[#6d28d9] to-[#9333ea] px-7 py-7 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <TicketCheck className="size-4" />
            E-Ticket
          </span>
          <h2
            id="ticket-title"
            className="mt-4 pr-10 font-heading text-2xl font-bold"
          >
            {ticket.event.eventName}
          </h2>
          <p className="mt-1 text-sm text-purple-100">{ticketCode}</p>
        </div>

        <div className="px-7 py-7">
          <div className="grid grid-cols-[1fr_auto] items-center gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Date
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1e1b2e]">
                  {formatEventDate(ticket.event.startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Location
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1e1b2e]">
                  {ticket.event.venue}, {ticket.event.location}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Tickets
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1e1b2e]">
                  {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e8def8] bg-white p-3 shadow-sm">
              <QRCodeSVG
                value={`EVORA|${ticketCode}|EVENT:${ticket.eventId}`}
                size={132}
                level="H"
                marginSize={1}
                fgColor="#1e1b2e"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-dashed border-[#d8caef] pt-5 text-center">
            <p className="text-xs leading-relaxed text-zinc-500">
              Tunjukkan QR ini kepada petugas saat memasuki acara. E-ticket
              hanya berlaku untuk pesanan berstatus DONE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketCard = ({
  ticket,
  onOpen,
}: {
  ticket: CustomerTransaction;
  onOpen: () => void;
}) => (
  <article className="overflow-hidden rounded-2xl border border-[#e8def8] bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="grid sm:grid-cols-[180px_1fr]">
      <div className="h-44 bg-gradient-to-br from-[#ddd0f4] to-[#bfa6e8] sm:h-full">
        {ticket.event.thumbnail ? (
          <img
            src={ticket.event.thumbnail}
            alt={ticket.event.eventName}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <TicketCheck className="size-12 text-white/80" />
          </div>
        )}
      </div>

      <div className="flex flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6d28d9]">
              {getOrderCode(ticket.id)}
            </span>
            <h3 className="mt-1 font-heading text-xl font-bold text-[#1e1b2e]">
              {ticket.event.eventName}
            </h3>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="mt-4 grid gap-2 text-sm text-[#52525b]">
          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#6d28d9]" />
            {formatEventDate(ticket.event.startDate)}
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#6d28d9]" />
            {ticket.event.venue}, {ticket.event.location}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee7f8] pt-4">
          <div>
            <p className="text-xs text-zinc-500">Ticket quantity</p>
            <p className="font-semibold text-[#1e1b2e]">
              {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""}
            </p>
          </div>
          <Button
            type="button"
            onClick={onOpen}
            className="rounded-xl bg-[#6d28d9] px-4 font-semibold text-white hover:bg-[#5b21b6]"
          >
            <QrCode className="mr-2 size-4" />
            Lihat E-Ticket
          </Button>
        </div>
      </div>
    </div>
  </article>
);

const MyTickets = ({
  transactions,
}: {
  transactions: CustomerTransaction[];
}) => {
  const [period, setPeriod] = useState<TicketPeriod>("upcoming");
  const [selectedTicket, setSelectedTicket] =
    useState<CustomerTransaction | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const completedTickets = useMemo(
    () => transactions.filter((transaction) => transaction.status === "DONE"),
    [transactions],
  );

  const displayedTickets = useMemo(() => {
    return completedTickets
      .filter((transaction) => {
        const startsAt = new Date(transaction.event.startDate).getTime();
        return period === "upcoming"
          ? startsAt >= currentTime
          : startsAt < currentTime;
      })
      .sort((first, second) => {
        const firstDate = new Date(first.event.startDate).getTime();
        const secondDate = new Date(second.event.startDate).getTime();
        return period === "upcoming"
          ? firstDate - secondDate
          : secondDate - firstDate;
      });
  }, [completedTickets, currentTime, period]);

  const upcomingCount = completedTickets.filter(
    (transaction) =>
      new Date(transaction.event.startDate).getTime() >= currentTime,
  ).length;
  const pastCount = completedTickets.length - upcomingCount;

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#6d28d9]">Customer area</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-[#1e1b2e]">
            My Tickets
          </h1>
          <p className="mt-2 text-sm text-[#71717a]">
            Semua tiket dari transaksi yang telah dikonfirmasi.
          </p>
        </div>

        <div className="inline-flex w-fit rounded-xl bg-[#eee7f8] p-1">
          {(
            [
              ["upcoming", `Upcoming (${upcomingCount})`],
              ["past", `Past (${pastCount})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                period === value
                  ? "bg-white text-[#6d28d9] shadow-sm"
                  : "text-[#71717a] hover:text-[#3f3f46]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {displayedTickets.length > 0 ? (
        <div className="grid gap-5">
          {displayedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onOpen={() => setSelectedTicket(ticket)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={period === "upcoming" ? CalendarDays : History}
          title={
            period === "upcoming"
              ? "No upcoming tickets"
              : "No past tickets yet"
          }
          description={
            period === "upcoming"
              ? "Tiket acara mendatang dengan status DONE akan muncul di sini."
              : "Riwayat tiket acara yang telah berlangsung akan muncul di sini."
          }
        />
      )}

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};

const OrderCard = ({ order }: { order: CustomerTransaction }) => {
  const isWaitingForPayment = order.status === "WAITING_FOR_PAYMENT";

  return (
    <article className="rounded-2xl border border-[#e8def8] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 gap-4">
          <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-[#f3edff] sm:flex">
            <ReceiptText className="size-6 text-[#6d28d9]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6d28d9]">
              {getOrderCode(order.id)}
            </p>
            <h3 className="mt-1 truncate font-heading text-xl font-bold text-[#1e1b2e]">
              {order.event.eventName}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Ordered {formatShortDate(order.createdAt)}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-5 grid gap-4 border-y border-[#eee7f8] py-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500">Event date</p>
          <p className="mt-1 font-medium text-[#3f3f46]">
            {formatShortDate(order.event.startDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Location</p>
          <p className="mt-1 font-medium text-[#3f3f46]">
            {order.event.venue}, {order.event.location}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Quantity</p>
          <p className="mt-1 font-medium text-[#3f3f46]">
            {order.quantity} ticket{order.quantity > 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Total</p>
          <p className="mt-1 font-bold text-[#1e1b2e]">
            {formatIDR(order.finalPrice)}
          </p>
        </div>
      </div>

      {isWaitingForPayment && (
        <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Clock3 className="size-5 text-amber-700" />
            </span>
            <Countdown deadline={order.paymentDeadline} />
          </div>
          <UploadProofButton
            transactionId={order.id}
            deadline={order.paymentDeadline}
          />
        </div>
      )}

      {order.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p>
            Bukti pembayaran sudah diterima dan sedang diperiksa oleh
            penyelenggara.
          </p>
        </div>
      )}
    </article>
  );
};

const MyOrders = ({
  transactions,
}: {
  transactions: CustomerTransaction[];
}) => (
  <>
    <div className="mb-6">
      <p className="text-sm font-semibold text-[#6d28d9]">Customer area</p>
      <h1 className="mt-1 font-heading text-3xl font-bold text-[#1e1b2e]">
        My Orders
      </h1>
      <p className="mt-2 text-sm text-[#71717a]">
        Pantau semua transaksi, status pembayaran, dan batas waktu pembayaran.
      </p>
    </div>

    {transactions.length > 0 ? (
      <div className="grid gap-5">
        {transactions.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    ) : (
      <EmptyState
        icon={ReceiptText}
        title="No orders yet"
        description="Setelah membeli tiket, detail dan status transaksi Anda akan muncul di sini."
      />
    )}
  </>
);

const CustomerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView: DashboardView =
    searchParams.get("view") === "orders" ? "orders" : "tickets";
  const {
    data: transactions = [],
    isPending,
    isError,
    refetch,
    isFetching,
  } = useCustomerTransactions();

  const setActiveView = (view: DashboardView) => {
    setSearchParams(view === "tickets" ? {} : { view });
  };

  return (
    <div className="min-h-screen bg-[#f7f3fc]">
      <Navbar />

      <main className="mx-auto grid max-w-7xl gap-7 px-5 py-8 md:px-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-12 lg:py-12">
        <aside className="h-fit rounded-2xl border border-[#e8def8] bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <div className="flex items-center gap-3 border-b border-[#eee7f8] px-2 pb-4">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 items-center justify-center rounded-full bg-[#f3edff]">
                <User className="size-5 text-[#6d28d9]" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#1e1b2e]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>

          <nav
            className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1"
            aria-label="Customer dashboard"
          >
            <button
              type="button"
              onClick={() => setActiveView("tickets")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                activeView === "tickets"
                  ? "bg-[#6d28d9] text-white"
                  : "text-[#52525b] hover:bg-[#f3edff] hover:text-[#6d28d9]"
              }`}
            >
              <TicketCheck className="size-5 shrink-0" />
              My Tickets
            </button>
            <button
              type="button"
              onClick={() => setActiveView("orders")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                activeView === "orders"
                  ? "bg-[#6d28d9] text-white"
                  : "text-[#52525b] hover:bg-[#f3edff] hover:text-[#6d28d9]"
              }`}
            >
              <ReceiptText className="size-5 shrink-0" />
              My Orders
            </button>
          </nav>
        </aside>

        <section className="min-w-0">
          {isPending ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-white">
              <div className="text-center">
                <Loader2 className="mx-auto size-9 animate-spin text-[#6d28d9]" />
                <p className="mt-3 text-sm text-zinc-500">
                  Loading your transactions...
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 text-center">
              <AlertCircle className="size-10 text-red-500" />
              <h1 className="mt-4 font-heading text-2xl font-bold text-[#1e1b2e]">
                Failed to load dashboard
              </h1>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Transaksi belum dapat dimuat. Pastikan API aktif lalu coba
                kembali.
              </p>
              <Button
                type="button"
                disabled={isFetching}
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-[#6d28d9] px-5 font-semibold text-white hover:bg-[#5b21b6]"
              >
                <RefreshCw
                  className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Try Again
              </Button>
            </div>
          ) : activeView === "tickets" ? (
            <MyTickets transactions={transactions} />
          ) : (
            <MyOrders transactions={transactions} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
