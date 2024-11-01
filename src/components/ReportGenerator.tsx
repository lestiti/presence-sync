import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomDatePicker from './CustomDatePicker';
import { formatAttendanceData } from '../utils/attendanceUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AttendanceRecord } from '../utils/types';
import { Card } from "@/components/ui/card";

interface ReportGeneratorProps {
  attendanceData: AttendanceRecord[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ attendanceData }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const filterDataByDateRange = () => {
    return attendanceData.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner une date de début et de fin.");
      return;
    }

    if (endDate < startDate) {
      toast.error("La date de fin doit être postérieure à la date de début.");
      return;
    }

    const filteredData = filterDataByDateRange();
    if (filteredData.length === 0) {
      toast.error("Aucune donnée trouvée pour cette période.");
      return;
    }

    toast.success("Rapport généré avec succès !");
  };

  const handleDownload = (type: 'pdf' | 'excel') => {
    const filteredData = filterDataByDateRange();
    if (filteredData.length === 0) {
      toast.error("Aucune donnée à exporter pour cette période.");
      return;
    }

    const formattedData = formatAttendanceData(filteredData);

    if (type === 'pdf') {
      const pdf = new jsPDF();
      pdf.text("Rapport de présence FPVM", 20, 10);
      pdf.setFontSize(12);
      pdf.text(`Période : ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 20, 20);
      
      (pdf as any).autoTable({
        head: [['Nom', 'Fonction', 'Date', 'Entrée', 'Sortie', 'Durée']],
        body: formattedData.map(entry => [
          entry.userName,
          entry.userRole,
          entry.date,
          entry.checkIn,
          entry.checkOut,
          entry.duration
        ]),
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [218, 165, 32] }
      });
      
      pdf.save(`rapport_presence_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.pdf`);
      toast.success("Rapport PDF téléchargé avec succès !");
    } else if (type === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
      XLSX.writeFile(workbook, `rapport_presence_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.xlsx`);
      toast.success("Rapport Excel téléchargé avec succès !");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date de début</label>
          <CustomDatePicker date={startDate} setDate={setStartDate} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date de fin</label>
          <CustomDatePicker date={endDate} setDate={setEndDate} />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={handleGenerateReport}
          className="bg-gold text-black hover:bg-yellow-600"
        >
          Générer le rapport
        </Button>
        <Button 
          onClick={() => handleDownload('pdf')}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Télécharger PDF
        </Button>
        <Button 
          onClick={() => handleDownload('excel')}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Télécharger Excel
        </Button>
      </div>
    </div>
  );
};

export default ReportGenerator;