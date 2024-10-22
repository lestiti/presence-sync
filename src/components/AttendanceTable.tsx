import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAttendanceData } from '../utils/attendanceUtils';

const AttendanceTable = ({ attendanceData }) => {
  const formattedData = formatAttendanceData(attendanceData);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Function</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedData.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{entry.userId}</TableCell>
            <TableCell>{entry.userRole}</TableCell>
            <TableCell>{entry.date}</TableCell>
            <TableCell>{entry.checkIn}</TableCell>
            <TableCell>{entry.checkOut}</TableCell>
            <TableCell>{entry.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;