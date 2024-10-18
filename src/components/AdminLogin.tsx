import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (id === 'Fpvm services' && password === 'FpvmCh2024*') {
      onLogin(true);
      toast.success("Connexion admin réussie");
    } else {
      onLogin(false);
      toast.error("Identifiants incorrects");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="ID Admin"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="bg-gray-800 text-white border-gold"
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-gray-800 text-white border-gold"
      />
      <Button onClick={handleLogin} className="bg-gold text-black hover:bg-yellow-600">
        Connexion Admin
      </Button>
    </div>
  );
};

export default AdminLogin;