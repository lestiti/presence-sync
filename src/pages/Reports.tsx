import React from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gold">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gold">Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Cette page est en cours de développement. Les rapports seront bientôt disponibles.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;