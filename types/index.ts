export type UserRole = "client" | "admin";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentMethod = "cash" | "card";

export type CascadeOfferStatus = "pending" | "accepted" | "rejected" | "timeout";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  userId: string; // ID del cliente
  barberId: string; // ID del barbero
  date: Date;
  time: string; // "09:00"
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string; // Stripe SetupIntent ID
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  positionInQueue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  barberId: string;
  dayOfWeek: number; // 0-6 (Domingo-Sábado)
  isActive: boolean;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface CascadeOffer {
  id: string;
  originalAppointmentId: string; // Cita cancelada
  offeredToAppointmentId: string; // Cita a la que se ofrece
  newTime: string;
  status: CascadeOfferStatus;
  expiresAt: Date;
  createdAt: Date;
}

