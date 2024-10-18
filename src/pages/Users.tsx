import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from '../utils/types';
import Header from '../components/Header';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'qrCode'>>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      qrCode: `QR_${Date.now()}`, // Placeholder for QR code generation
    };
    setUsers(prev => [...prev, user]);
    setNewUser({ firstName: '', lastName: '', phoneNumber: '', role: '' });
    toast.success("Utilisateur ajouté avec succès !");
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("Utilisateur supprimé avec succès !");
  };

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
                    <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">
                      Supprimer
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Users;