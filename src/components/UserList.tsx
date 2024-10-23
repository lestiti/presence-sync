import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateQRCode } from '../utils/qrCodeUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <ScrollArea className="h-[60vh]">
          <ul className="space-y-4">
            {users.map(user => (
              <li key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-4 rounded-lg gap-4">
                <div>
                  <p className="font-bold">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                  <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Button 
                    onClick={() => handleDownloadQR(user.id)} 
                    disabled={generatingQR === user.id}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    {generatingQR === user.id ? 'Génération...' : 'Télécharger QR'}
                  </Button>
                  <Button 
                    onClick={() => handleDeleteUser(user.id)} 
                    variant="destructive"
                    className="w-full md:w-auto"
                  >
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserList;