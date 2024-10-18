import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomDatePicker from '../components/CustomDatePicker';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

// Simulons des données d'entrées et sorties, y compris pour aujourd'hui
const today = new Date();
const mockAttendanceData = [
  { id: 1, name: "John Doe", checkIn: "2023-05-01T08:00:00", checkOut: "2023-05-01T17:00:00" },
  { id: 2, name: "Jane Smith", checkIn: "2023-05-01T08:30:00", checkOut: "2023-05-01T16:45:00" },
  { id: 3, name: "Alice Johnson", checkIn: today.toISOString(), checkOut: new Date(today.getTime() + 8 * 60 * 60 * 1000).toISOString() },
  // ... ajoutez plus de données simulées si nécessaire
];

const Reports = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      // Filtrer les données selon la plage de dates sélectionnée
      const filteredData = mockAttendanceData.filter(entry => {
        const entryDate = new Date(entry.checkIn);
        return entryDate >= startDate && entryDate <= endDate;
      });
      setAttendanceData(filteredData);
      toast.success("Rapport généré avec succès !");
    } else {
      toast.error("Veuillez sélectionner une date de début et de fin.");
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Rapport de présence", 20, 10);
    
    attendanceData.forEach((entry, index) => {
      const yPosition = 20 + (index * 10);
      pdf.text(`${entry.name}: Entrée ${new Date(entry.checkIn).toLocaleString()} - Sortie ${new Date(entry.checkOut).toLocaleString()}`, 20, yPosition);
    });

    pdf.save("rapport_presence.pdf");
    toast.success("Téléchargement du rapport PDF terminé !");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gold">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gold">Rapports de présence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-400">Date de début</label>
                <CustomDatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-400">Date de fin</label>
                <CustomDatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleGenerateReport} className="bg-gold text-black hover:bg-yellow-600">
                Générer le rapport
              </Button>
              <Button onClick={handleDownloadPDF} className="bg-blue-500 text-white hover:bg-blue-600">
                <FileDown className="mr-2 h-4 w-4" />
                Télécharger en PDF
              </Button>
            </div>
            {attendanceData.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Entrée</TableHead>
                    <TableHead>Sortie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{new Date(entry.checkIn).toLocaleString()}</TableCell>
                      <TableCell>{new Date(entry.checkOut).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;