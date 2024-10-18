import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomDatePicker from '../components/CustomDatePicker';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import localforage from 'localforage';
import { AttendanceRecord, User } from '../utils/types';

const Reports = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const storedUsers = await localforage.getItem<User[]>('users') || [];
      setUsers(storedUsers);
      const storedAttendance = await localforage.getItem<AttendanceRecord[]>('attendance') || [];
      setAttendanceData(storedAttendance);
    };
    loadData();
  }, []);

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      const filteredData = attendanceData.filter(entry => {
        const entryDate = new Date(entry.timestamp);
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
      const user = users.find(u => u.id === entry.userId);
      const yPosition = 20 + (index * 10);
      pdf.text(`${user?.firstName} ${user?.lastName}: ${entry.type} à ${new Date(entry.timestamp).toLocaleString()}`, 20, yPosition);
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
                    <TableHead>Type</TableHead>
                    <TableHead>Horodatage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((entry, index) => {
                    const user = users.find(u => u.id === entry.userId);
                    return (
                      <TableRow key={index}>
                        <TableCell>{user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'}</TableCell>
                        <TableCell>{entry.type === 'check-in' ? 'Entrée' : 'Sortie'}</TableCell>
                        <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
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