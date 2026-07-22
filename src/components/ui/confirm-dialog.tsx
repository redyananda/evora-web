import { AlertTriangle, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "success" | "danger";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const toneStyles = {
  primary: {
    icon: "bg-purple-100 text-purple-700",
    button: "bg-[#6d28d9] text-white hover:bg-[#5b21b6]",
  },
  success: {
    icon: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  danger: {
    icon: "bg-red-100 text-red-700",
    button: "bg-red-600 text-white hover:bg-red-700",
  },
};

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  const style = toneStyles[tone];
  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1d102d]/65 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
            <Icon className="size-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
            aria-label="Close confirmation dialog"
          >
            <X className="size-5" />
          </button>
        </div>
        <h2 id="confirm-dialog-title" className="mt-5 font-heading text-2xl font-semibold text-[#211333]">
          {title}
        </h2>
        <p id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-zinc-500">
          {description}
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl border border-purple-100 bg-white px-5 text-zinc-600 hover:bg-purple-50"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-xl px-5 ${style.button}`}
          >
            {isPending && <LoaderCircle className="size-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
