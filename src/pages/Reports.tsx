import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import ReportGenerator from '../components/ReportGenerator';
import AttendanceTable from '../components/AttendanceTable';
import { useSession } from '@supabase/auth-helpers-react';

const Reports = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    } else {
      fetchAttendanceData();
    }
  }, [session, navigate]);

  const fetchAttendanceData = async () => {
    const { data, error } = await supabase.from('attendance').select('*');
    if (error) {
      console.error('Error fetching attendance data:', error);
    } else {
      setAttendanceData(data);
    }
  };

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