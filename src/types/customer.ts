import type { TransactionStatus } from "@/types/organizer";

export interface CustomerTransaction {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  status: TransactionStatus;
  totalPrice: number;
  pointUsed: number | null;
  finalPrice: number;
  paymentProof: string | null;
  paymentDeadline: string;
  confirmationDeadline: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  event: {
    id: number;
    eventName: string;
    slug: string;
    venue: string;
    location: string;
    startDate: string;
    endDate: string;
    price: number;
    thumbnail: string | null;
  };
  voucher: {
    code: string;
    discount: number;
  } | null;
  coupon: {
    code: string;
    discount: number;
  } | null;
}

