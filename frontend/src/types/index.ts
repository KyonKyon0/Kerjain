export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "consumer" | "partner";
}

export interface AuthState {
  user: User | null;
  role: "consumer" | "partner" | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, role: "consumer" | "partner", token: string) => void;
  logout: () => void;
}

export type JobStatus = 
  | "PUBLISHED"
  | "ACCEPTED" 
  | "ON_THE_WAY"
  | "WORKING"
  | "WAITING_CONFIRMATION" 
  | "COMPLETED" 
  | "CANCELLED";

export interface JobProgress {
  id: string;
  jobId: string;
  statusSnapshot: JobStatus;
  note?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  consumerId: string;
  consumerName: string;
  partnerId?: string;
  partnerName?: string;
  title: string;
  description: string;
  address: string;
  rewardType: "FLEXIBLE" | "FIXED";
  rewardAmount?: number;
  status: JobStatus;
  createdAt: string;
  category?: string;
  lat?: number;
  lng?: number;
  distance?: number;
}

export type PaymentMethod = "VA" | "QRIS" | "TRANSFER" | "CASH";
export type PaymentStatus = "UNPAID" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  jobId: string;
  consumerId: string;
  partnerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  targetId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "NEW_JOB" | "JOB_ACCEPTED" | "STATUS_CHANGED" | "NEW_MESSAGE" | "PAYMENT" | "JOB_COMPLETED" | "SYSTEM";
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  content: string;
  createdAt: string;
  type: "TEXT" | "SYSTEM";
  read: boolean;
}
