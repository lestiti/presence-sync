import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomDatePicker from './CustomDatePicker';
import { formatAttendanceData } from '../utils/attendanceUtils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const ReportGenerator = ({ attendanceData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      const filteredData = attendanceData.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });
      toast.success("Report generated successfully!");
    } else {
      toast.error("Please select a start and end date.");
    }
  };

  const handleDownload = (type) => {
    const formattedData = formatAttendanceData(attendanceData);
    if (type === 'pdf') {
      const pdf = new jsPDF();
      pdf.text("Attendance Report", 20, 10);
      pdf.table(20, 20, formattedData, ['User ID', 'Date', 'Check In', 'Check Out', 'Duration']);
      pdf.save("attendance_report.pdf");
    } else if (type === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
      XLSX.writeFile(workbook, "attendance_report.xlsx");
    }
    toast.success(`${type.toUpperCase()} report downloaded successfully!`);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex space-x-4">
        <CustomDatePicker date={startDate} setDate={setStartDate} />
        <CustomDatePicker date={endDate} setDate={setEndDate} />
      </div>
      <Button onClick={handleGenerateReport} className="bg-gold text-black hover:bg-yellow-600">
        Generate Report
      </Button>
      <Button onClick={() => handleDownload('pdf')} className="bg-blue-500 text-white hover:bg-blue-600">
        Download PDF
      </Button>
      <Button onClick={() => handleDownload('excel')} className="bg-green-500 text-white hover:bg-green-600">
        Download Excel
      </Button>
    </div>
  );
};

export default ReportGenerator;