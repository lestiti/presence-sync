import React from 'react';
import Header from '../components/Header';
import ReportGenerator from '../components/ReportGenerator';
import AttendanceTable from '../components/AttendanceTable';
import { useQuery } from '@tanstack/react-query';
import { getAttendanceRecords } from '../utils/attendanceUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  const { data: attendanceData = [] } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendanceRecords
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gold mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gold">Générateur de Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportGenerator attendanceData={attendanceData} />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gold">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gold">Historique des Présences</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;