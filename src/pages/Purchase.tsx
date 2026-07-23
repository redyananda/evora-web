import { useMemo, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router";
import { useCreateTransaction } from "@/hooks/api/transaction/useCreateTransaction";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Coins,
  Gift,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Plus,
  Ticket,
  TicketPercent,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";
import useGetEventVouchers from "@/hooks/api/event/useGetEventVouchers";
import { useProfile } from "@/hooks/api/profile/useProfile";
import { useAuthStore } from "@/store/auth.store";

const TAX_RATE = 0.11;

const formatIDR = (value: number) =>
  value === 0 ? "Free" : `IDR ${value.toLocaleString("id-ID")}`;

// Always shows the "IDR" prefix, even for 0 (used for line items in the summary).
const formatRupiah = (value: number) => `IDR ${value.toLocaleString("id-ID")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const Purchase = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: event, isPending, isError } = useGetEventBySlug(slug ?? "");
  const { data: vouchers } = useGetEventVouchers(slug ?? "");
  const { data: profile } = useProfile();

  const user = useAuthStore((state) => state.user);

  const initialQty = Math.max(1, Number(searchParams.get("tickets")) || 1);
  const [quantity, setQuantity] = useState(initialQty);
  const [promoCode, setPromoCode] = useState("");

  const [appliedPromo, setAppliedPromo] = useState<{
    type: "voucher" | "coupon";
    code: string;
    discount: number;
  } | null>(null);
  const [pointsInput, setPointsInput] = useState("");
  const { mutate: createTransaction, isPending: isProcessing } =
    useCreateTransaction();

  const maxPerOrder = event
    ? Math.max(1, Math.min(3, event.availableSeats))
    : 3;

  const activeCoupons = useMemo(
    () => profile?.coupons.filter((coupon) => coupon.status === "ACTIVE") ?? [],
    [profile?.coupons],
  );

  const pointBalance = profile?.userPoint ?? 0;

  const { basePrice, promoDiscount, taxableAmount, tax, bill, pointsUsed, total } =
    useMemo(() => {
      const base = (event?.price ?? 0) * quantity;

      const promo = appliedPromo ? Math.min(appliedPromo.discount, base) : 0;
      const taxable = base - promo;
      const t = Math.round(taxable * TAX_RATE);
      const dueBeforePoints = taxable + t;

      const requestedPoints = Math.max(0, Math.floor(Number(pointsInput) || 0));
      const pUsed = Math.min(requestedPoints, pointBalance, dueBeforePoints);

      return {
        basePrice: base,
        promoDiscount: promo,
        taxableAmount: taxable,
        tax: t,
        bill: dueBeforePoints,
        pointsUsed: pUsed,
        total: dueBeforePoints - pUsed,
      };
    }, [event?.price, quantity, appliedPromo, pointsInput, pointBalance]);

  const maxRedeemablePoints = useMemo(
    () => Math.min(pointBalance, bill),
    [pointBalance, bill],
  );

  const applyCode = (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!code) return;

    const voucher = vouchers?.find((v) => v.code === code);
    if (voucher) {
      setAppliedPromo({ type: "voucher", code, discount: voucher.discount });
      setPromoCode(code);
      toast.success("Voucher applied");
      return;
    }

    const coupon = activeCoupons.find((c) => c.code === code);
    if (coupon) {
      setAppliedPromo({ type: "coupon", code, discount: coupon.discount });
      setPromoCode(code);
      toast.success("Coupon applied");
      return;
    }

    toast.error("Invalid or expired promo code");
  };

  const handleApplyPromo = () => applyCode(promoCode);

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  const handleCompleteRegistration = () => {
    if (!event || !user) return;
    createTransaction(
      {
        eventId: event.id,
        quantity,

        ...(appliedPromo?.type === "voucher"
          ? { voucherCode: appliedPromo.code }
          : {}),
        ...(appliedPromo?.type === "coupon"
          ? { couponCode: appliedPromo.code }
          : {}),
        ...(pointsUsed > 0 ? { pointsToUse: pointsUsed } : {}),
      },
      {
        onSuccess: (res) => {
          const order = res.data;

          if (order.status === "DONE") {
            toast.success("You're registered! Your ticket is confirmed.");
          }

          navigate(`/events/${event.slug}/payment?txn=${order.id}`, {
            state: {
              transactionId: order.id,
              total: order.finalPrice,
              quantity,
              attendee: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              },
            },
          });
        },
      },
    );
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
            Event not found
          </h1>
          <p className="text-[15px] text-[#52525b]">
            The event you're trying to book doesn't exist or has been removed.
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

  const soldOut = event.availableSeats <= 0;

  return (
    <div className="min-h-screen bg-[#f3edff]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 lg:px-16">
        {/* Back link */}
        <Link
          to={`/events/${event.slug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#71717a] transition-colors hover:text-[#6d28d9]"
        >
          <ArrowLeft className="size-4" />
          Back to event
        </Link>

        {/* Event header */}
        <header className="mb-8">
          <span className="inline-block rounded-full bg-[#d9f99d] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#3f6212]">
            {event.category.replaceAll("_", " ")}
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[#1e1b2e] sm:text-4xl">
            {event.eventName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-[#52525b]">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[#6d28d9]" />
              {formatDate(event.startDate)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-[#6d28d9]" />
              {event.venue}, {event.location}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Step 1 — Select tickets */}
            <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6d28d9] text-sm font-bold text-white">
                  1
                </span>
                <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
                  Select Tickets
                </h2>
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl border-2 border-[#6d28d9] bg-[#faf7ff] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <Ticket className="size-4 text-[#6d28d9]" />
                    <h3 className="text-base font-semibold text-[#1e1b2e]">
                      Event ticket
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-[#52525b]">
                    Full event access including workshop areas and food court.
                  </p>
                  <p className="mt-2 font-heading text-lg font-bold text-[#6d28d9]">
                    {formatIDR(event.price)}
                  </p>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-3 self-start rounded-full border border-[#e4d9ff] bg-white px-2 py-1 sm:self-center">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex size-9 items-center justify-center rounded-full text-[#6d28d9] transition-colors hover:bg-[#f3edff] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center text-base font-semibold text-[#1e1b2e]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((q) => Math.min(maxPerOrder, q + 1))
                    }
                    disabled={quantity >= maxPerOrder}
                    className="flex size-9 items-center justify-center rounded-full bg-[#6d28d9] text-white transition-colors hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-[#a1a1aa]">
                {soldOut
                  ? "This event is sold out."
                  : `${event.availableSeats} seats left · max ${maxPerOrder} per order.`}
              </p>
            </section>

            {/* Step 2 — Attendee information (pulled from the signed-in account) */}
            <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6d28d9] text-sm font-bold text-white">
                    2
                  </span>
                  <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
                    Attendee Information
                  </h2>
                </div>
                <span className="hidden items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#16a34a] sm:inline-flex">
                  <CheckCircle2 className="size-3.5" />
                  From your account
                </span>
              </div>

              <p className="mt-4 text-sm text-[#52525b]">
                We'll register these tickets under your Evora account details.
              </p>

              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#efe7ff] bg-[#faf7ff] p-5">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#ede4ff] font-heading text-lg font-bold uppercase text-[#6d28d9]">
                    {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
                      "?"}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-[#1e1b2e]">
                    {user ? `${user.firstName} ${user.lastName}` : "—"}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-[#52525b]">
                    <Mail className="size-4 shrink-0 text-[#6d28d9]" />
                    <span className="truncate">{user?.email ?? "—"}</span>
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="hidden shrink-0 rounded-lg border border-[#e4d9ff] bg-white px-4 py-2 text-sm font-semibold text-[#6d28d9] transition-colors hover:bg-[#f3edff] sm:inline-block"
                >
                  Edit profile
                </Link>
              </div>
            </section>
          </div>

          {/* ── Right column — Order summary ────────────────────────────── */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="font-heading text-xl font-bold text-[#1e1b2e]">
                Order Summary
              </h2>

              {/*
                Receipt order
              */}
              <div className="mt-5 space-y-2.5 border-t border-[#efe7ff] pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#52525b]">
                    Subtotal{" "}
                    <span className="text-[#a1a1aa]">(x{quantity})</span>
                  </span>
                  <span className="font-medium text-[#1e1b2e]">
                    {formatRupiah(basePrice)}
                  </span>
                </div>

                {appliedPromo && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#52525b]">
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                          <CheckCircle2 className="size-3.5" />
                          {appliedPromo.code}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
                          {appliedPromo.type}
                        </span>
                      </span>
                      <span className="font-medium text-[#16a34a]">
                        - {formatRupiah(promoDiscount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#52525b]">Taxable amount</span>
                      <span className="font-medium text-[#1e1b2e]">
                        {formatRupiah(taxableAmount)}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#52525b]">Tax (11%)</span>
                  <span className="font-medium text-[#1e1b2e]">
                    {formatRupiah(tax)}
                  </span>
                </div>

                {pointsUsed > 0 && (
                  <>
                    <div className="flex items-center justify-between border-t border-[#efe7ff] pt-2.5">
                      <span className="text-[#52525b]">Amount due</span>
                      <span className="font-medium text-[#1e1b2e]">
                        {formatRupiah(bill)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#52525b]">
                        Points
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                          <Coins className="size-3.5" />
                          {pointsUsed.toLocaleString("id-ID")} pts
                        </span>
                      </span>
                      <span className="font-medium text-[#16a34a]">
                        - {formatRupiah(pointsUsed)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#efe7ff] pt-4">
                <span className="text-base font-semibold text-[#1e1b2e]">
                  Total
                </span>
                <span className="font-heading text-2xl font-bold text-[#6d28d9]">
                  {formatIDR(total)}
                </span>
              </div>

              <Button
                type="button"
                onClick={handleCompleteRegistration}
                disabled={soldOut || isProcessing || !user}
                className="mt-5 h-12 w-full rounded-xl bg-[#6d28d9] text-base font-semibold text-white shadow-sm hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : soldOut ? (
                  "Sold Out"
                ) : total === 0 ? (
                  "Get Free Ticket"
                ) : (
                  "Complete Registration"
                )}
              </Button>

              {/* Promo code — a voucher OR a coupon; only one applies per order */}
              <div className="mt-5 border-t border-[#efe7ff] pt-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#6d28d9]">
                  <TicketPercent className="size-3.5" />
                  Promo code
                  <span className="font-normal text-[#a1a1aa]">
                    · voucher or coupon, one per order
                  </span>
                </p>

                {appliedPromo ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#6d28d9] bg-[#faf7ff] px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[#6d28d9]">
                      <CheckCircle2 className="size-4" />
                      {appliedPromo.code}
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
                        {appliedPromo.type}
                      </span>
                      <span className="font-medium text-[#16a34a]">
                        -{formatRupiah(appliedPromo.discount)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={clearPromo}
                      aria-label="Remove promo code"
                      className="flex size-6 items-center justify-center rounded-full text-[#71717a] transition-colors hover:bg-[#efe7ff] hover:text-[#6d28d9]"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo Code"
                      className="h-10 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim()}
                      className="h-10 rounded-lg border border-[#e4d9ff] bg-white px-4 text-sm font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff] disabled:opacity-50"
                    >
                      Apply
                    </Button>
                  </div>
                )}

                {vouchers && vouchers.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#6d28d9]">
                      <TicketPercent className="size-3.5" />
                      Available vouchers
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vouchers.map((voucher) => {
                        const active =
                          appliedPromo?.type === "voucher" &&
                          appliedPromo.code === voucher.code;
                        return (
                          <button
                            key={voucher.id}
                            type="button"
                            onClick={() => applyCode(voucher.code)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                              active
                                ? "border-[#6d28d9] bg-[#6d28d9] text-white"
                                : "border-[#e4d9ff] bg-white text-[#6d28d9] hover:bg-[#f3edff]"
                            }`}
                          >
                            <span className="tracking-wide">{voucher.code}</span>
                            <span className={active ? "text-white/80" : "text-[#a1a1aa]"}>
                              -{formatRupiah(voucher.discount)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeCoupons.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#6d28d9]">
                      <Gift className="size-3.5" />
                      Your coupons
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeCoupons.map((coupon) => {
                        const active =
                          appliedPromo?.type === "coupon" &&
                          appliedPromo.code === coupon.code;
                        return (
                          <button
                            key={coupon.id}
                            type="button"
                            onClick={() => applyCode(coupon.code)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                              active
                                ? "border-[#6d28d9] bg-[#6d28d9] text-white"
                                : "border-[#e4d9ff] bg-white text-[#6d28d9] hover:bg-[#f3edff]"
                            }`}
                          >
                            <span className="tracking-wide">{coupon.code}</span>
                            <span className={active ? "text-white/80" : "text-[#a1a1aa]"}>
                              -{formatRupiah(coupon.discount)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Points — redeem the loyalty balance against the payable amount */}
              {pointBalance > 0 && (
                <div className="mt-5 border-t border-[#efe7ff] pt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#6d28d9]">
                      <Coins className="size-3.5" />
                      Use points
                    </p>
                    <span className="text-xs text-[#71717a]">
                      Balance: {pointBalance.toLocaleString("id-ID")} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={maxRedeemablePoints}
                      value={pointsInput}
                      onChange={(e) => setPointsInput(e.target.value)}
                      placeholder="0"
                      className="h-10 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => setPointsInput(String(maxRedeemablePoints))}
                      disabled={maxRedeemablePoints <= 0}
                      className="h-10 rounded-lg border border-[#e4d9ff] bg-white px-4 text-sm font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff] disabled:opacity-50"
                    >
                      Use max
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-[#a1a1aa]">
                    Up to {maxRedeemablePoints.toLocaleString("id-ID")} pts can be
                    applied to this order · 1 pt = IDR 1.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Purchase;
