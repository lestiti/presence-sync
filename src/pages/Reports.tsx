import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ReportGenerator from '../components/ReportGenerator';
import AttendanceTable from '../components/AttendanceTable';
import { getAttendanceRecords } from '../utils/attendanceUtils';

const Reports = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const records = getAttendanceRecords();
    setAttendanceData(records);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ReportGenerator attendanceData={attendanceData} />
        <AttendanceTable />
      </main>
    </div>
  );
};

export default Reports;