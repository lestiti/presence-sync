import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAttendanceRecords } from '../utils/attendanceUtils';
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceTable = () => {
  const { data: groupedData, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendanceRecords
  });

  const formatTime = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom et Prénom</TableHead>
          <TableHead>Fonction</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Heure</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedData?.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{entry.userName || 'N/A'}</TableCell>
            <TableCell>{entry.userRole}</TableCell>
            <TableCell>{new Date(entry.timestamp).toLocaleDateString()}</TableCell>
            <TableCell>{entry.type === 'check-in' ? 'Entrée' : 'Sortie'}</TableCell>
            <TableCell>{formatTime(entry.timestamp)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;