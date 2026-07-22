import type { AuthUser } from "@/store/auth.store";

export interface OrganizerProfile {
  organizerName: string;
  organizerDescription: string | null;
  organizerLogo: string | null;
  rating: number;
  totalReviews: number;
}

export interface PointReward {
  id: number;
  amount: number;
  createdAt: string;
  expiredAt: string;
  status: "ACTIVE" | "EXPIRED";
}

export interface CouponReward {
  id: number;
  code: string;
  discount: number;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  expiredAt: string;
  status: "ACTIVE" | "EXPIRED" | "USED";
}

export interface Profile extends AuthUser {
  phoneNumber: string | null;
  address: string | null;
  referredById: number | null;
  createdAt: string;
  updatedAt: string;
  organizer: OrganizerProfile | null;
  referralCount: number;
  points: PointReward[];
  coupons: CouponReward[];
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  profilePicture: string | null;
  organizerName?: string;
  organizerDescription?: string | null;
}

