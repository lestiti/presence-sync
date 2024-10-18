import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from '../components/Header';
import QRScanner from '../components/QRScanner';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gold">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gold">Bienvenue sur FPVM Checking</CardTitle>
            <CardDescription className="text-gray-400">Gérez vos présences facilement avec notre système de pointage par QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
              Gérer les utilisateurs
            </Button>
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
              Voir les rapports
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Index;