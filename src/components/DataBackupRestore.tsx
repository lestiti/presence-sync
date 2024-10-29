import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DataBackupRestore = () => {
  const exportData = async () => {
    try {
      const zip = new JSZip();
      
      // Récupérer toutes les données du localStorage
      const users = localStorage.getItem('users') || '[]';
      const attendance = localStorage.getItem('attendance') || '[]';
      const config = localStorage.getItem('fpvmStorageConfig') || '{}';
      
      // Ajouter les données au fichier ZIP
      zip.file('users.json', users);
      zip.file('attendance.json', attendance);
      zip.file('config.json', config);
      
      // Générer et télécharger le fichier ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `fpvm-data-${new Date().toISOString().split('T')[0]}.zip`);
      
      toast.success("Données exportées avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'exportation des données");
      console.error('Export error:', error);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      // Charger et vérifier les données du ZIP
      const usersPromise = zipContent.file('users.json')?.async('string') || Promise.resolve('[]');
      const attendancePromise = zipContent.file('attendance.json')?.async('string') || Promise.resolve('[]');
      const configPromise = zipContent.file('config.json')?.async('string') || Promise.resolve('{}');
      
      const [users, attendance, config] = await Promise.all([
        usersPromise,
        attendancePromise,
        configPromise
      ]);

      // Vérifier que les données sont valides
      JSON.parse(users);
      JSON.parse(attendance);
      JSON.parse(config);
      
      // Sauvegarder les données dans le localStorage
      localStorage.setItem('users', users);
      localStorage.setItem('attendance', attendance);
      localStorage.setItem('fpvmStorageConfig', config);
      
      toast.success("Données importées avec succès");
      // Recharger la page pour appliquer les nouvelles données
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
          onClick={exportData}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Exporter les données
        </Button>
        <div>
          <input
            type="file"
            accept=".zip"
            onChange={importData}
            className="hidden"
            id="import-data"
          />
          <Button
            onClick={() => document.getElementById('import-data')?.click()}
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10"
          >
            Importer des données
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataBackupRestore;