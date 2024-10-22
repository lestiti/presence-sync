import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateQRCode } from '../utils/qrCodeUtils';

const UserList = ({ users, onUserDeleted }) => {
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  const handleDeleteUser = async (id) => {
    // Simulating user deletion without Supabase
    console.log('Deleting user:', id);
    toast.success("User deleted successfully!");
    onUserDeleted();
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
    <ul className="space-y-4">
      {users.map(user => (
        <li key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded">
          <div>
            <p className="font-bold">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-400">{user.role}</p>
          </div>
          <div className="space-x-2">
            <Button 
              onClick={() => handleDownloadQR(user.id)} 
              disabled={generatingQR === user.id}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {generatingQR === user.id ? 'Génération...' : 'Télécharger QR'}
            </Button>
            <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;