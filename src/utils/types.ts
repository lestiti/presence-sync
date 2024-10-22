export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  qrCode: string;
}

export interface AttendanceRecord {
  userId: string;
  timestamp: Date;
  type: 'check-in' | 'check-out';
  userRole: string; // Add this line
}