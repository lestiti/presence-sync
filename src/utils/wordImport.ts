import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import { User } from './types';
import { generateQRCode } from './qrCodeUtils';
import { toast } from "sonner";

const extractUserInfo = (text: string): Partial<User>[] => {
  // Format attendu: "Nom: Dupont, Prénom: Jean, Téléphone: 0123456789, Fonction: Manager"
  const users: Partial<User>[] = [];
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    try {
      const parts = line.split(',').map(part => part.trim());
      const user: Partial<User> = {
        id: uuidv4(),
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: '',
      };

      for (const part of parts) {
        const [key, value] = part.split(':').map(s => s.trim());
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
        users.push(user);
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la ligne:', line);
    }
  }

  return users;
};

export const importUsersFromWord = async (file: File): Promise<User[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const users = extractUserInfo(result.value);
    
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