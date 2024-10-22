import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ReportGenerator from '../components/ReportGenerator';
import AttendanceTable from '../components/AttendanceTable';

const Reports = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating data fetching without Supabase
    const mockData = [
      { userId: '1', timestamp: new Date(), type: 'check-in' },
      { userId: '1', timestamp: new Date(Date.now() + 3600000), type: 'check-out' },
      // Add more mock data as needed
    ];
    setAttendanceData(mockData);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ReportGenerator attendanceData={attendanceData} />
        <AttendanceTable attendanceData={attendanceData} />
      </main>
    </div>
  );
};

export default Reports;