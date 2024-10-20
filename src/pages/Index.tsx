import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from '../components/Header';
import QRScanner from '../components/QRScanner';
import AdminLogin from '../components/AdminLogin';
import localforage from 'localforage';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const Index = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginAdmin, logoutAdmin } = useAdminAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleReset = async () => {
    if (isAdminLoggedIn) {
      try {
        await localforage.clear();
        toast.success("L'application a été réinitialisée avec succès.");
        logoutAdmin();
      } catch (error) {
        console.error("Erreur lors de la réinitialisation:", error);
        toast.error("Une erreur est survenue lors de la réinitialisation.");
      }
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLogin = (success: boolean) => {
    loginAdmin(success);
    setShowAdminLogin(false);
    if (success) {
      handleReset();
    }
  };

  const handleNavigate = (path: string) => {
    if (isAdminLoggedIn) {
      navigate(path);
    } else {
      setShowAdminLogin(true);
    }
  };

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
            {showAdminLogin ? (
              <AdminLogin onLogin={handleAdminLogin} />
            ) : (
              <QRScanner />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="border-gold text-gold hover:bg-gold hover:text-black"
              onClick={() => handleNavigate('/users')}
            >
              Gérer les utilisateurs
            </Button>
            <Button 
              variant="outline" 
              className="border-gold text-gold hover:bg-gold hover:text-black"
              onClick={() => handleNavigate('/reports')}
            >
              Voir les rapports
            </Button>
            <Button onClick={handleReset} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
              Réinitialiser l'application
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Index;