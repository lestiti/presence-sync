import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomDatePicker from './CustomDatePicker';
import { formatAttendanceData } from '../utils/attendanceUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AttendanceRecord } from '../utils/types';

interface ReportGeneratorProps {
  attendanceData: AttendanceRecord[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ attendanceData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      const filteredData = attendanceData.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });
      toast.success("Rapport généré avec succès !");
    } else {
      toast.error("Veuillez sélectionner une date de début et de fin.");
    }
  };

  const handleDownload = (type: 'pdf' | 'excel') => {
    const formattedData = formatAttendanceData(attendanceData);
    if (type === 'pdf') {
      const pdf = new jsPDF();
      pdf.text("Rapport de présence", 20, 10);
      (pdf as any).autoTable({
        head: [['ID Utilisateur', 'Date', 'Entrée', 'Sortie', 'Durée']],
        body: formattedData.map(entry => [entry.userId, entry.date, entry.checkIn, entry.checkOut, entry.duration]),
        startY: 20
      });
      pdf.save("rapport_presence.pdf");
    } else if (type === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
      XLSX.writeFile(workbook, "rapport_presence.xlsx");
    }
    toast.success(`Rapport ${type.toUpperCase()} téléchargé avec succès !`);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex space-x-4">
        <CustomDatePicker date={startDate} setDate={setStartDate} />
        <CustomDatePicker date={endDate} setDate={setEndDate} />
      </div>
      <Button onClick={handleGenerateReport} className="bg-gold text-black hover:bg-yellow-600">
        Générer le rapport
      </Button>
      <Button onClick={() => handleDownload('pdf')} className="bg-blue-500 text-white hover:bg-blue-600">
        Télécharger PDF
      </Button>
      <Button onClick={() => handleDownload('excel')} className="bg-green-500 text-white hover:bg-green-600">
        Télécharger Excel
      </Button>
    </div>
  );
};

export default ReportGenerator;