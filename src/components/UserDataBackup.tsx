import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateQRCode } from '../utils/qrCodeUtils';

const UserDataBackup = () => {
  const exportUsers = async () => {
    try {
      const zip = new JSZip();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Ajouter les données utilisateurs au ZIP
      zip.file('users.json', JSON.stringify(users, null, 2));
      
      // Générer et ajouter les QR codes pour chaque utilisateur
      const qrPromises = users.map(async (user) => {
        const qrCode = await generateQRCode(user.id);
        zip.file(`qr_codes/${user.id}.png`, qrCode.split(',')[1], {base64: true});
      });
      
      await Promise.all(qrPromises);
      
      // Générer et télécharger le fichier ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `fpvm-users-${new Date().toISOString().split('T')[0]}.zip`);
      
      toast.success("Données utilisateurs exportées avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'exportation des données");
      console.error('Export error:', error);
    }
  };

  const importUsers = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      // Charger les données utilisateurs
      const usersFile = zipContent.file('users.json');
      if (!usersFile) {
        throw new Error('Fichier users.json non trouvé');
      }
      
      const usersData = await usersFile.async('string');
      const users = JSON.parse(usersData);
      
      // Sauvegarder les données dans le localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      toast.success("Données utilisateurs importées avec succès");
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de l'importation des données");
      console.error('Import error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          onClick={exportUsers}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Exporter les utilisateurs
        </Button>
        <div>
          <input
            type="file"
            accept=".zip"
            onChange={importUsers}
            className="hidden"
            id="import-users"
          />
          <Button
            onClick={() => document.getElementById('import-users')?.click()}
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10"
          >
            Importer des utilisateurs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDataBackup;