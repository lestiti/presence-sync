import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from 'lucide-react';
import { importUsersFromWord } from '../utils/wordImport';

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
          loadUsers(); // Recharger la liste après l'import
          toast.success(`${importedUsers.length} utilisateurs importés avec succès`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'importation:', error);
        toast.error("Erreur lors de l'importation du fichier Word");
      }
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
              <Button 
                onClick={() => handleDeleteUser(user.id)} 
                variant="destructive"
                className="w-full md:w-auto"
              >
                Supprimer
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;