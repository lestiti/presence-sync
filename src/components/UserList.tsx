import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Download, Edit } from 'lucide-react';
import { importUsersFromWord } from '../utils/wordImport';
import { generateQRCode } from '../utils/qrCodeUtils';
import { getUsers, deleteUser } from '../utils/userUtils';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditUserForm from './EditUserForm';

const UserList = () => {
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Utilisateur supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error('Error deleting user:', error);
    }
  });

  const handleWordImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        toast.info("Importation en cours...");
        const importedUsers = await importUsersFromWord(file);
        if (importedUsers.length > 0) {
          queryClient.invalidateQueries({ queryKey: ['users'] });
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
      link.download = `qr-code-${user.first_name}-${user.last_name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code téléchargé avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du QR Code");
      console.error('Error downloading QR code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full mt-8 bg-gray-900 rounded-lg">
      <div className="flex flex-row justify-between items-center p-4">
        <h2 className="text-white text-xl">Liste des utilisateurs</h2>
        <div className="flex gap-2">
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
          {users?.map(user => (
            <li key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 p-4 rounded-lg gap-4">
              <div className="text-white">
                <p className="font-bold text-lg">{user.first_name} {user.last_name}</p>
                <p className="text-gray-300">{user.role}</p>
                <p className="text-gray-300">{user.phone_number}</p>
                <p className="text-gray-300">Synode: {user.synode || 'Non spécifié'}</p>
                <p className="text-gray-300">Église: {user.eglise || 'Non spécifiée'}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier l'utilisateur</DialogTitle>
                    </DialogHeader>
                    <EditUserForm user={user} onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ['users'] });
                    }} />
                  </DialogContent>
                </Dialog>
                <Button 
                  onClick={() => handleDownloadQR(user)}
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  QR Code
                </Button>
                <Button 
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                      deleteMutation.mutate(user.id);
                    }
                  }}
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