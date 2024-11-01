import React from 'react';
import Header from '../components/Header';
import ReportGenerator from '../components/ReportGenerator';
import AttendanceTable from '../components/AttendanceTable';

const Reports = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ReportGenerator attendanceData={[]} />
        <AttendanceTable />
      </main>
    </div>
  );
};

export default Reports;