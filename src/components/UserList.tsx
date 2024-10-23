import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateQRCode } from '../utils/qrCodeUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  };

  const handleDeleteUser = async (id) => {
    try {
      const updatedUsers = users.filter(user => user.id !== id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error('Error deleting user:', error);
    }
  };

  const handleDownloadQR = async (userId: string) => {
    try {
      setGeneratingQR(userId);
      const qrCodeDataUrl = await generateQRCode(userId);
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `qr-code-${userId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code téléchargé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération du QR Code");
    } finally {
      setGeneratingQR(null);
    }
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <div>
                <p className="font-bold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
                <p className="text-sm text-gray-600">{user.phoneNumber}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  onClick={() => handleDownloadQR(user.id)} 
                  disabled={generatingQR === user.id}
                  variant="outline"
                >
                  {generatingQR === user.id ? 'Génération...' : 'Télécharger QR'}
                </Button>
                <Button 
                  onClick={() => handleDeleteUser(user.id)} 
                  variant="destructive"
                >
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserList;