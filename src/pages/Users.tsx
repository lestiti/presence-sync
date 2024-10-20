import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from '../utils/types';
import Header from '../components/Header';
import QRCode from 'qrcode';
import localforage from 'localforage';
import AdminLogin from '../components/AdminLogin';
import { useAdminAuth } from '../hooks/useAdminAuth';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'qrCode'>>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAdminLogin, setShowAdminLogin] = useState(true);
  const { isAdminLoggedIn, loginAdmin } = useAdminAuth();

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await localforage.getItem<User[]>('users');
      if (storedUsers) {
        setUsers(storedUsers);
      }
    };
    loadUsers();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const generateQRCode = async (userId: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(userId);
    } catch (err) {
      console.error(err);
      return '';
    }
  };

  const handleAddUser = async () => {
    const userId = Date.now().toString();
    const qrCode = await generateQRCode(userId);
    const user: User = {
      ...newUser,
      id: userId,
      qrCode,
    };
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    await localforage.setItem('users', updatedUsers);
    setNewUser({ firstName: '', lastName: '', phoneNumber: '', role: '' });
    toast.success("Utilisateur ajouté avec succès !");
  };

  const handleDeleteUser = async (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    await localforage.setItem('users', updatedUsers);
    toast.success("Utilisateur supprimé avec succès !");
  };

  const handleDownloadQR = (user: User) => {
    const link = document.createElement('a');
    link.href = user.qrCode;
    link.download = `${user.firstName}_${user.lastName}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code téléchargé avec succès !");
  };

  const handleRegenerateQR = async (user: User) => {
    const newQRCode = await generateQRCode(user.id);
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, qrCode: newQRCode } : u);
    setUsers(updatedUsers);
    await localforage.setItem('users', updatedUsers);
    toast.success("QR Code régénéré avec succès !");
  };

  const handleAdminLogin = (success: boolean) => {
    loginAdmin(success);
    setShowAdminLogin(false);
    if (success) {
      toast.success("Connexion admin réussie. Vous pouvez maintenant gérer les utilisateurs.");
    }
  };

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-gray-900 border-gold">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gold">Connexion Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminLogin onLogin={handleAdminLogin} />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-gray-900 border-gold">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gold">Accès refusé</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Vous n'avez pas les droits d'accès à cette page.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gold mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gold">Ajouter un nouvel utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="space-y-4">
              <Input
                placeholder="Prénom"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-gold"
              />
              <Input
                placeholder="Nom"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-gold"
              />
              <Input
                placeholder="Numéro de téléphone"
                name="phoneNumber"
                value={newUser.phoneNumber}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-gold"
              />
              <Input
                placeholder="Fonction"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-gold"
              />
              <Button type="submit" className="bg-gold text-black hover:bg-yellow-600">
                Ajouter l'utilisateur
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gold">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gold">Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-gray-400">Aucun utilisateur enregistré.</p>
            ) : (
              <ul className="space-y-4">
                {users.map(user => (
                  <li key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded">
                    <div>
                      <p className="font-bold">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-400">{user.role}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleDownloadQR(user)} className="bg-gold text-black hover:bg-yellow-600">
                        Télécharger QR
                      </Button>
                      <Button onClick={() => handleRegenerateQR(user)} className="bg-blue-500 hover:bg-blue-600">
                        Régénérer QR
                      </Button>
                      <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">
                        Supprimer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {!isOnline && (
          <div className="mt-4 p-4 bg-yellow-500 text-black rounded">
            Vous êtes actuellement hors ligne. Les modifications seront synchronisées lorsque vous serez de nouveau en ligne.
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;