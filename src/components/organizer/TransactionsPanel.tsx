import { useState } from "react";
import { Check, Eye, FileQuestion, LoaderCircle, ReceiptText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  useOrganizerEvents,
  useOrganizerTransactions,
  useUpdateTransactionStatus,
} from "@/hooks/api/organizer/useOrganizer";
import type { OrganizerTransaction, TransactionStatus } from "@/types/organizer";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const statuses: Array<{ value: "" | TransactionStatus; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "WAITING_FOR_ADMIN_CONFIRMATION", label: "Need review" },
  { value: "DONE", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WAITING_FOR_PAYMENT", label: "Awaiting payment" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELED", label: "Canceled" },
];

const badgeStyle: Record<TransactionStatus, string> = {
  WAITING_FOR_PAYMENT: "bg-blue-100 text-blue-700",
  WAITING_FOR_ADMIN_CONFIRMATION: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-zinc-100 text-zinc-600",
  CANCELED: "bg-zinc-100 text-zinc-600",
};

const statusLabel = (status: TransactionStatus) =>
  statuses.find((item) => item.value === status)?.label ?? status;

const PaymentProofModal = ({ transaction, onClose }: { transaction: OrganizerTransaction; onClose: () => void }) => {
  const proof = transaction.paymentProof;
  const isPdf = proof?.startsWith("data:application/pdf") || /\.pdf($|\?)/i.test(proof ?? "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d102d]/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div><h3 className="font-heading text-xl font-semibold text-[#211333]">Payment proof #{transaction.id}</h3><p className="text-sm text-zinc-500">{transaction.user.firstName} {transaction.user.lastName} · {transaction.event.eventName}</p></div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-zinc-500 hover:bg-purple-50" aria-label="Close payment proof"><X className="size-5" /></button>
        </div>
        {proof ? isPdf ? (
          <iframe src={proof} title={`Payment proof ${transaction.id}`} className="h-[65vh] w-full rounded-2xl border border-purple-100" />
        ) : (
          <img src={proof} alt={`Payment proof for transaction ${transaction.id}`} className="max-h-[65vh] w-full rounded-2xl bg-zinc-50 object-contain" />
        ) : (
          <div className="flex h-72 flex-col items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500"><FileQuestion className="mb-3 size-10" /> No payment proof uploaded.</div>
        )}
        {proof && <a href={proof} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:underline">Open proof in a new tab</a>}
      </div>
    </div>
  );
};

const TransactionsPanel = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"" | TransactionStatus>("WAITING_FOR_ADMIN_CONFIRMATION");
  const [eventId, setEventId] = useState<number | undefined>();
  const [proofTransaction, setProofTransaction] = useState<OrganizerTransaction | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    transaction: OrganizerTransaction;
    action: "ACCEPT" | "REJECT";
  } | null>(null);
  const { data: events } = useOrganizerEvents(1, "", 50);
  const { data, isLoading } = useOrganizerTransactions(page, status || undefined, eventId);
  const updateStatus = useUpdateTransactionStatus();
  const pages = Math.max(1, Math.ceil((data?.meta.total ?? 0) / (data?.meta.take ?? 10)));

  const process = (transaction: OrganizerTransaction, action: "ACCEPT" | "REJECT") => {
    setPendingAction({ transaction, action });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">Payment management</p>
        <h2 className="mt-1 font-heading text-3xl font-semibold text-[#211333]">Transactions</h2>
        <p className="mt-1 text-sm text-zinc-500">Verify payment proof, then accept or reject each order.</p>
      </div>
      <div className="flex flex-wrap gap-3 rounded-2xl border border-purple-100 bg-white p-3">
        <select value={status} onChange={(event) => { setStatus(event.target.value as "" | TransactionStatus); setPage(1); }} className="h-10 min-w-48 rounded-xl border border-purple-100 bg-white px-3 text-sm outline-none focus:border-purple-400">
          {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <select value={eventId ?? ""} onChange={(event) => { setEventId(event.target.value ? Number(event.target.value) : undefined); setPage(1); }} className="h-10 min-w-56 rounded-xl border border-purple-100 bg-white px-3 text-sm outline-none focus:border-purple-400">
          <option value="">All events</option>
          {events?.data.map((event) => <option key={event.id} value={event.id}>{event.eventName}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-purple-700"><LoaderCircle className="mr-2 size-5 animate-spin" /> Loading transactions...</div>
        ) : data?.data.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-purple-50 text-xs uppercase tracking-wider text-zinc-500">
                <tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Event</th><th className="px-5 py-4">Order</th><th className="px-5 py-4">Total paid</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Proof</th><th className="px-5 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {data.data.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-purple-50/40">
                    <td className="px-5 py-4"><p className="font-semibold text-[#211333]">{transaction.user.firstName} {transaction.user.lastName}</p><p className="text-xs text-zinc-500">{transaction.user.email}</p></td>
                    <td className="max-w-56 px-5 py-4"><p className="truncate font-medium text-[#211333]">{transaction.event.eventName}</p><p className="text-xs text-zinc-500">{formatDate(transaction.createdAt)}</p></td>
                    <td className="px-5 py-4"><p className="font-semibold">#{transaction.id}</p><p className="text-xs text-zinc-500">{transaction.quantity} ticket(s)</p></td>
                    <td className="px-5 py-4"><p className="font-semibold text-purple-700">{formatIDR(transaction.finalPrice)}</p>{Boolean(transaction.pointUsed) && <p className="text-xs text-zinc-500">{transaction.pointUsed?.toLocaleString("id-ID")} points</p>}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeStyle[transaction.status]}`}>{statusLabel(transaction.status)}</span></td>
                    <td className="px-5 py-4"><button type="button" onClick={() => setProofTransaction(transaction)} className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100"><Eye className="size-3.5" /> View</button></td>
                    <td className="px-5 py-4">
                      {transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION" ? (
                        <div className="flex justify-end gap-2">
                          <Button disabled={updateStatus.isPending} onClick={() => process(transaction, "REJECT")} className="rounded-xl bg-red-50 text-red-700 hover:bg-red-100"><X className="size-4" /> Reject</Button>
                          <Button disabled={updateStatus.isPending} onClick={() => process(transaction, "ACCEPT")} className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"><Check className="size-4" /> Accept</Button>
                        </div>
                      ) : <span className="block text-right text-xs text-zinc-400">Processed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-zinc-500"><ReceiptText className="mb-3 size-10 text-purple-300" /><p className="font-semibold text-[#211333]">No transactions found</p><p className="mt-1 text-sm">Try a different status or event filter.</p></div>
        )}
      </div>
      {pages > 1 && <div className="flex items-center justify-center gap-3"><Button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl bg-white text-purple-700 hover:bg-purple-50">Previous</Button><span className="text-sm text-zinc-500">Page {page} of {pages}</span><Button disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-xl bg-white text-purple-700 hover:bg-purple-50">Next</Button></div>}
      {proofTransaction && <PaymentProofModal transaction={proofTransaction} onClose={() => setProofTransaction(null)} />}
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.action === "ACCEPT" ? "Accept this transaction?" : "Reject this transaction?"}
        description={
          pendingAction?.action === "ACCEPT"
            ? `Payment for transaction #${pendingAction.transaction.id} will be approved and the customer will receive a notification email.`
            : `Transaction #${pendingAction?.transaction.id ?? ""} will be rejected. Seats and all used points, vouchers, or coupons will be returned.`
        }
        confirmLabel={pendingAction?.action === "ACCEPT" ? "Accept payment" : "Reject payment"}
        tone={pendingAction?.action === "ACCEPT" ? "success" : "danger"}
        isPending={updateStatus.isPending}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          if (!pendingAction) return;
          updateStatus.mutate(
            {
              transactionId: pendingAction.transaction.id,
              action: pendingAction.action,
            },
            { onSuccess: () => setPendingAction(null) }
          );
        }}
      />
    </div>
  );
};

export default TransactionsPanel;
