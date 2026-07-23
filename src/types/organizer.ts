import type { PaginationMeta } from "@/types/pagination";

export type StatisticPeriod = "day" | "month" | "year";
export type TransactionStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "DONE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELED";

export type EventCategory =
  | "MUSIC"
  | "TECH_AND_INNOVATION"
  | "FOOD_AND_DRINK"
  | "ARTS_AND_CULTURE"
  | "BUSINESS"
  | "WELLNESS";

export interface DashboardStatisticPoint {
  label: string;
  revenue: number;
  tickets: number;
  transactions: number;
}

export interface OrganizerDashboardData {
  period: StatisticPeriod;
  range: { start: string; end: string };
  summary: {
    totalEvents: number;
    upcomingEvents: number;
    revenue: number;
    ticketsSold: number;
    acceptedTransactions: number;
    pendingTransactions: number;
  };
  statusCounts: Record<TransactionStatus, number>;
  series: DashboardStatisticPoint[];
  topEvents: Array<{
    eventId: number;
    eventName: string;
    revenue: number;
    tickets: number;
  }>;
}

export interface OrganizerReview {
  id: number;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string | null;
  eventName: string;
  createdAt: string;
}

export interface OrganizerProfile {
  id: number;
  organizerName: string;
  organizerDescription: string | null;
  organizerLogo: string | null;
  rating: number;
  totalReviews: number;
  totalEvents: number;
  createdAt: string;
  reviews: OrganizerReview[];
}

export interface OrganizerEvent {
  id: number;
  eventName: string;
  description: string;
  slug: string;
  category: EventCategory;
  price: number;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  transactionCount: number;
  ticketsSold: number;
  revenue: number;
}

export interface EventFormPayload {
  eventName: string;
  description: string;
  category: EventCategory;
  price: number;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  thumbnail: string | null;
}

export interface OrganizerTransaction {
  id: number;
  quantity: number;
  status: TransactionStatus;
  totalPrice: number;
  pointUsed: number | null;
  finalPrice: number;
  paymentProof: string | null;
  paymentDeadline: string;
  paidAt: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  event: { id: number; eventName: string; thumbnail: string | null };
  voucher: { code: string; discount: number } | null;
  coupon: { code: string; discount: number } | null;
}

export interface ParticipantData {
  event: { id: number; eventName: string };
  summary: { participantCount: number; tickets: number; revenue: number };
  data: Array<{
    transactionId: number;
    name: string;
    email: string;
    quantity: number;
    totalPaid: number;
    paidAt: string;
  }>;
}

export interface OrganizerVoucher {
  id: number;
  eventId: number;
  code: string;
  discount: number;
  total: number;
  availableVoucher: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  event: { id: number; eventName: string };
  claimedCount: number;
  isActive: boolean;
}

export interface VoucherFormPayload {
  eventId: number;
  code: string;
  discount: number;
  total: number;
  startDate: string;
  endDate: string;
}

export interface PaginatedOrganizerEvents {
  data: OrganizerEvent[];
  meta: PaginationMeta;
}

export interface PaginatedOrganizerTransactions {
  data: OrganizerTransaction[];
  meta: PaginationMeta;
}
