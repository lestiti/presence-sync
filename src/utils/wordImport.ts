import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import { User } from './types';
import { generateQRCode } from './qrCodeUtils';
import { toast } from "sonner";

const extractUserInfo = (text: string): Partial<User>[] => {
  // Format attendu (FR): "Nom: Dupont, Prénom: Jean, Téléphone: 0123456789, Fonction: Manager"
  // Format attendu (MG): "Anarana: Dupont, Fanampiny: Jean, Tel: 0123456789, Asa: Manager"
  console.log('Texte extrait du fichier:', text); // Log du texte brut
  
  const users: Partial<User>[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  console.log('Nombre de lignes trouvées:', lines.length); // Log du nombre de lignes

  for (const line of lines) {
    try {
      console.log('Traitement de la ligne:', line); // Log de chaque ligne
      const parts = line.split(',').map(part => part.trim());
      const user: Partial<User> = {
        id: uuidv4(),
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: '',
      };

      for (const part of parts) {
        console.log('Analyse de la partie:', part); // Log de chaque partie
        const [key, value] = part.split(':').map(s => s.trim());
        if (!key || !value) {
          console.log('Format invalide pour la partie:', part);
          continue;
        }

        switch (key.toLowerCase()) {
          case 'nom':
          case 'anarana':
            user.lastName = value;
            break;
          case 'prénom':
          case 'fanampiny':
            user.firstName = value;
            break;
          case 'téléphone':
          case 'tel':
            user.phoneNumber = value;
            break;
          case 'fonction':
          case 'asa':
            user.role = value;
            break;
          default:
            console.log('Clé non reconnue:', key);
        }
      }

      if (user.firstName && user.lastName) {
        console.log('Utilisateur extrait:', user); // Log de l'utilisateur créé
        users.push(user);
      } else {
        console.log('Utilisateur incomplet ignoré:', user);
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la ligne:', line, error);
    }
  }

  return users;
};

export const importUsersFromWord = async (file: File): Promise<User[]> => {
  try {
    console.log('Début de l\'importation du fichier:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log('Texte extrait du document Word:', result.value);
    
    const users = extractUserInfo(result.value);
    console.log('Utilisateurs extraits:', users);
    
    if (users.length === 0) {
      toast.error("Aucun utilisateur n'a été trouvé dans le fichier");
      return [];
    }

    // Générer les QR codes pour chaque utilisateur
    const completeUsers = await Promise.all(
      users.map(async (user) => {
        const qrCode = await generateQRCode(user.id as string);
        return {
          ...user,
          qrCode
        } as User;
      })
    );

    // Sauvegarder les utilisateurs dans le localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = [...existingUsers, ...completeUsers];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast.success(`${completeUsers.length} utilisateurs importés avec succès`);
    return completeUsers;
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    toast.error("Erreur lors de l'importation du fichier Word");
    throw error;
  }
};