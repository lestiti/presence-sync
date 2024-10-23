import { AttendanceRecord } from './types';

export const saveAttendanceRecord = (userId: string, type: 'check-in' | 'check-out') => {
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.id === userId);
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const newRecord: AttendanceRecord = {
    userId,
    timestamp: new Date(),
    type,
    userRole: user.role
  };

  attendance.push(newRecord);
  localStorage.setItem('attendance', JSON.stringify(attendance));
  return newRecord;
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  return JSON.parse(localStorage.getItem('attendance') || '[]');
};