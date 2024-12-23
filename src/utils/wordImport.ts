import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import { User } from './types';
import { generateQRCode } from './qrCodeUtils';
import { toast } from "sonner";

const extractUserInfo = (text: string): Partial<User>[] => {
  console.log('Texte brut extrait:', text);
  
  const users: Partial<User>[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    try {
      // Nettoyage et normalisation de la ligne
      const cleanLine = line.trim().replace(/\s+/g, ' ');
      console.log('Traitement de la ligne:', cleanLine);
      
      // Vérification du format attendu
      if (!cleanLine.includes('Nom:') || !cleanLine.includes('Prénom:')) {
        console.log('Format invalide, ligne ignorée:', cleanLine);
        continue;
      }

      const parts = cleanLine.split(',').map(part => part.trim());
      const user: Partial<User> = {
        id: uuidv4(),
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: '',
      };

      for (const part of parts) {
        const [key, value] = part.split(':').map(s => s.trim());
        
        if (!key || !value) {
          console.log('Partie invalide ignorée:', part);
          continue;
        }

        console.log('Traitement de la partie:', key, '=', value);

        switch (key.toLowerCase()) {
          case 'nom':
            user.lastName = value;
            break;
          case 'prénom':
            user.firstName = value;
            break;
          case 'téléphone':
            user.phoneNumber = value;
            break;
          case 'fonction':
            user.role = value;
            break;
        }
      }

      if (user.firstName && user.lastName) {
        console.log('Utilisateur extrait avec succès:', user);
        users.push(user);
      } else {
        console.log('Utilisateur incomplet ignoré:', user);
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la ligne:', line, error);
    }
  }

  console.log('Nombre total d\'utilisateurs extraits:', users.length);
  return users;
};

export const importUsersFromWord = async (file: File): Promise<User[]> => {
  try {
    console.log('Début de l\'importation du fichier:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log('Texte extrait du document Word:', result.value);
    
    const users = extractUserInfo(result.value);
    
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