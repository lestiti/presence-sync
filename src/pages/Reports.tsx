import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomDatePicker from '../components/CustomDatePicker';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from 'lucide-react';

// Simulons des données d'entrées et sorties
const mockAttendanceData = [
  { id: 1, name: "John Doe", checkIn: "2023-05-01T08:00:00", checkOut: "2023-05-01T17:00:00" },
  { id: 2, name: "Jane Smith", checkIn: "2023-05-01T08:30:00", checkOut: "2023-05-01T16:45:00" },
  // ... ajoutez plus de données simulées si nécessaire
];

const Reports = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      // Ici, vous feriez normalement un appel API pour obtenir les données réelles
      // Pour cet exemple, nous utilisons simplement les données simulées
      toast.success("Rapport généré avec succès !");
      // Filtrer les données selon la plage de dates sélectionnée
      const filteredData = mockAttendanceData.filter(entry => {
        const entryDate = new Date(entry.checkIn);
        return entryDate >= startDate && entryDate <= endDate;
      });
      setAttendanceData(filteredData);
    } else {
      toast.error("Veuillez sélectionner une date de début et de fin.");
    }
  };

  const handleDownloadPDF = () => {
    // Ici, vous implémenteriez la logique réelle de génération de PDF
    // Pour cet exemple, nous simulons simplement le téléchargement
    toast.success("Téléchargement du rapport PDF...");
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'rapport_presence.pdf';
      link.click();
    }, 1000);
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