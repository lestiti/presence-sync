import { supabase } from "@/integrations/supabase/client";
import { AttendanceRecord } from './types';

export const saveAttendanceRecord = async (userId: string, type: 'check-in' | 'check-out') => {
  try {
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
      timestamp: new Date(data.timestamp),
      type: type,
      userRole: user.role,
      userName: `${user.first_name} ${user.last_name}`
    } as AttendanceRecord;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la présence:', error);
    throw error;
  }
};

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
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
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    throw error;
  }
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

  // Grouper les données par utilisateur et par date
  data.forEach(entry => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    const key = `${entry.userId}-${date}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(entry);
  });

  // Traiter les données groupées
  Object.values(groupedData).forEach(entries => {
    const checkIn = entries.find(e => e.type === 'check-in');
    const checkOut = entries.find(e => e.type === 'check-out');

    if (checkIn) {
      const checkInTime = new Date(checkIn.timestamp);
      const checkOutTime = checkOut ? new Date(checkOut.timestamp) : null;

      const duration = checkOutTime
        ? Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60))
        : 0;

      formattedData.push({
        userId: checkIn.userId,
        userName: checkIn.userName || 'N/A',
        userRole: checkIn.userRole || 'N/A',
        date: checkInTime.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        checkIn: checkInTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        checkOut: checkOutTime ? checkOutTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '-',
        duration: duration ? `${Math.floor(duration / 60)}h ${duration % 60}m` : '-'
      });
    }
  });

  return formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};