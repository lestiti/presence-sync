import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAttendanceRecords } from '../utils/attendanceUtils';

interface GroupedAttendance {
  userId: string;
  userName: string;
  userRole: string;
  date: string;
  checkIn: Date | null;
  checkOut: Date | null;
}

const AttendanceTable = () => {
  const [groupedData, setGroupedData] = useState<GroupedAttendance[]>([]);

  useEffect(() => {
    const records = getAttendanceRecords();
    const grouped = groupAttendanceRecords(records);
    setGroupedData(grouped);
  }, []);

  const groupAttendanceRecords = (records) => {
    const grouped = new Map();

    records.forEach(record => {
      const date = new Date(record.timestamp).toLocaleDateString();
      const key = `${record.userId}-${date}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          userId: record.userId,
          userName: record.userName,
          userRole: record.userRole,
          date: date,
          checkIn: null,
          checkOut: null
        });
      }

      const entry = grouped.get(key);
      if (record.type === 'check-in') {
        entry.checkIn = new Date(record.timestamp);
      } else {
        entry.checkOut = new Date(record.timestamp);
      }
    });

    return Array.from(grouped.values());
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleTimeString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom et Prénom</TableHead>
          <TableHead>Fonction</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Heure d'entrée</TableHead>
          <TableHead>Heure de sortie</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedData.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{entry.userName || 'N/A'}</TableCell>
            <TableCell>{entry.userRole}</TableCell>
            <TableCell>{entry.date}</TableCell>
            <TableCell>{formatTime(entry.checkIn)}</TableCell>
            <TableCell>{formatTime(entry.checkOut)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;