import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomDatePicker from '../components/CustomDatePicker';
import { toast } from "sonner";

const Reports = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      // Here you would typically call an API to generate the report
      console.log(`Generating report from ${startDate.toDateString()} to ${endDate.toDateString()}`);
      toast.success("Report generated successfully! Downloading Excel file...");
      // Simulating file download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'attendance_report.xlsx';
        link.click();
      }, 1000);
    } else {
      toast.error("Please select both start and end dates.");
    }
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
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-400">Date de début</label>
              <CustomDatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-400">Date de fin</label>
              <CustomDatePicker date={endDate} setDate={setEndDate} />
            </div>
            <Button onClick={handleGenerateReport} className="bg-gold text-black hover:bg-yellow-600">
              Générer le rapport
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;