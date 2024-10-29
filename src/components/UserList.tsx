import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Download } from 'lucide-react';
import { importUsersFromWord } from '../utils/wordImport';
import { generateQRCode } from '../utils/qrCodeUtils';

const UserList = () => {
  const [users, setUsers] = useState([]);

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

  const handleWordImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        toast.info("Importation en cours...");
        const importedUsers = await importUsersFromWord(file);
        if (importedUsers.length > 0) {
          loadUsers();
          toast.success(`${importedUsers.length} utilisateurs importés avec succès`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'importation:', error);
        toast.error("Erreur lors de l'importation du fichier Word");
      }
    }
  };

  const handleDownloadQR = async (user) => {
    try {
      const qrCode = await generateQRCode(user.id);
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `qr-code-${user.firstName}-${user.lastName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code téléchargé avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du QR Code");
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="w-full mt-8 bg-gray-900">
      <div className="flex flex-row justify-between items-center p-4">
        <h2 className="text-white text-xl">Liste des utilisateurs</h2>
        <div>
          <input
            type="file"
            accept=".docx"
            onChange={handleWordImport}
            className="hidden"
            id="word-import"
          />
          <Button
            onClick={() => document.getElementById('word-import')?.click()}
            variant="outline"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importer depuis Word
          </Button>
        </div>
      </div>
      <div className="p-4">
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 p-4 rounded-lg gap-4">
              <div className="text-white">
                <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                <p className="text-gray-300">{user.role}</p>
                <p className="text-gray-300">{user.phoneNumber}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleDownloadQR(user)}
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  QR Code
                </Button>
                <Button 
                  onClick={() => handleDeleteUser(user.id)} 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;