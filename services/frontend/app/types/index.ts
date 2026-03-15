export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "admin";
}

export interface SalaryRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  month: number;
  year: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
