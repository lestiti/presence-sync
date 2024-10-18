import { AttendanceRecord } from '../utils/types';

export const formatAttendanceData = (data: AttendanceRecord[]) => {
  const formattedData: { [key: string]: { userId: string, checkIn: string, checkOut: string }[] } = {};

  data.forEach(entry => {
    if (!formattedData[entry.userId]) {
      formattedData[entry.userId] = [];
    }

    const lastEntry = formattedData[entry.userId][formattedData[entry.userId].length - 1];

    if (!lastEntry || (lastEntry.checkIn && lastEntry.checkOut)) {
      formattedData[entry.userId].push({
        userId: entry.userId,
        checkIn: entry.type === 'check-in' ? new Date(entry.timestamp).toLocaleString() : '',
        checkOut: entry.type === 'check-out' ? new Date(entry.timestamp).toLocaleString() : ''
      });
    } else {
      if (entry.type === 'check-in') {
        lastEntry.checkIn = new Date(entry.timestamp).toLocaleString();
      } else {
        lastEntry.checkOut = new Date(entry.timestamp).toLocaleString();
      }
    }
  });

  return Object.values(formattedData).flat();
};