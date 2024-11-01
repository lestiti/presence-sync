import { supabase } from "@/integrations/supabase/client";
import { AttendanceRecord } from './types';

export const saveAttendanceRecord = async (userId: string, type: 'check-in' | 'check-out') => {
  const { data: user } = await supabase
    .from('users')
    .select('first_name, last_name, role')
    .eq('id', userId)
    .single();
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const { data, error } = await supabase
    .from('attendance')
    .insert({
      user_id: userId,
      type,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    userId,
    timestamp: data.timestamp,
    type: type,
    userRole: user.role,
    userName: `${user.first_name} ${user.last_name}`
  } as AttendanceRecord;
};

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id,
      user_id,
      timestamp,
      type,
      users (
        first_name,
        last_name,
        role
      )
    `)
    .order('timestamp', { ascending: false });

  if (error) throw error;

  return data.map(record => ({
    userId: record.user_id,
    timestamp: new Date(record.timestamp),
    type: record.type as 'check-in' | 'check-out',
    userRole: record.users?.role || 'N/A',
    userName: record.users ? `${record.users.first_name} ${record.users.last_name}` : 'N/A'
  }));
};

export const formatAttendanceData = (data: AttendanceRecord[]) => {
  const formattedData: {
    userId: string;
    userName: string;
    userRole: string;
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
        userName: checkIn.userName || 'N/A',
        userRole: checkIn.userRole || 'N/A',
        date: checkInTime.toLocaleDateString(),
        checkIn: checkInTime.toLocaleTimeString(),
        checkOut: checkOutTime ? checkOutTime.toLocaleTimeString() : '-',
        duration: duration ? `${Math.floor(duration / 60)}h ${duration % 60}m` : '-'
      });
    }
  });

  return formattedData;
};