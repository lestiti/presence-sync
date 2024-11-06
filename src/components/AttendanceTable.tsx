import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAttendanceRecords } from '../utils/attendanceUtils';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const AttendanceTable = () => {
  const { data: groupedData, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendanceRecords
  });

  const formatTime = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Nom et Prénom</TableHead>
            <TableHead className="font-bold">Fonction</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="font-bold">Heure</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData?.map((entry, index) => (
            <TableRow key={index} className="hover:bg-gray-100">
              <TableCell className="font-medium">{entry.userName || 'N/A'}</TableCell>
              <TableCell>{entry.userRole}</TableCell>
              <TableCell>{formatDate(entry.timestamp)}</TableCell>
              <TableCell>
                <Badge variant={entry.type === 'check-in' ? 'default' : 'secondary'}>
                  {entry.type === 'check-in' ? 'Entrée' : 'Sortie'}
                </Badge>
              </TableCell>
              <TableCell>{formatTime(entry.timestamp)}</TableCell>
            </TableRow>
          ))}
          {(!groupedData || groupedData.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                Aucun enregistrement trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;