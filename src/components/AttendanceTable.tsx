import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAttendanceRecords } from '../utils/attendanceUtils';

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const records = getAttendanceRecords();
    setAttendanceData(records);
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom et Prénom</TableHead>
          <TableHead>Fonction</TableHead>
          <TableHead>Date et Heure</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendanceData.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{entry.userName || 'N/A'}</TableCell>
            <TableCell>{entry.userRole}</TableCell>
            <TableCell>{formatDate(entry.timestamp)}</TableCell>
            <TableCell>{entry.type === 'check-in' ? 'Entrée' : 'Sortie'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;