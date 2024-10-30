import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAdminAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'Fpvm services' && password === '2024*FpvmCh') {
      login();
      toast.success("Connexion réussie!");
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="w-full max-w-md bg-gray-900 border-gold">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gold">
            Authentification Requise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Identifiant"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-yellow-600 text-black"
            >
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;