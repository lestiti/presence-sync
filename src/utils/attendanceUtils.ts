import { AttendanceRecord } from '../utils/types';

export const formatAttendanceData = (data: AttendanceRecord[]) => {
  const formattedData: {
    userId: string;
    date: string;
    checkIn: string;
    checkOut: string;
    duration: string;
  }[] = [];

  const groupedData: { [key: string]: AttendanceRecord[] } = {};

  // Group data by userId and date
  data.forEach(entry => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    const key = `${entry.userId}-${date}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(entry);
  });

  // Process grouped data
  Object.values(groupedData).forEach(entries => {
    const checkIn = entries.find(e => e.type === 'check-in');
    const checkOut = entries.find(e => e.type === 'check-out');

    if (checkIn) {
      const checkInTime = new Date(checkIn.timestamp);
      const checkOutTime = checkOut ? new Date(checkOut.timestamp) : null;

      const duration = checkOutTime
        ? Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)) // duration in minutes
        : 0;

      formattedData.push({
        userId: checkIn.userId,
        date: checkInTime.toLocaleDateString(),
        checkIn: checkInTime.toLocaleTimeString(),
        checkOut: checkOutTime ? checkOutTime.toLocaleTimeString() : '-',
        duration: duration ? `${Math.floor(duration / 60)}h ${duration % 60}m` : '-'
      });
    }
  });

  return formattedData;
};