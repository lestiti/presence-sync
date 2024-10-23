import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AddUserForm = ({ onUserAdded }) => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Simuler l'ajout d'un utilisateur avec un ID unique
      const userWithId = {
        ...newUser,
        id: Date.now().toString(), // Utiliser timestamp comme ID temporaire
      };
      
      // Stocker l'utilisateur dans le localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = [...existingUsers, userWithId];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast.success("Utilisateur ajouté avec succès!");
      setNewUser({ firstName: '', lastName: '', phoneNumber: '', role: '', email: '' });
      onUserAdded();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'utilisateur");
      console.error('Error adding user:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouvel utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Entrez le prénom"
              name="firstName"
              value={newUser.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              placeholder="Entrez le nom"
              name="lastName"
              value={newUser.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Entrez l'email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
            <Input
              id="phoneNumber"
              placeholder="Entrez le numéro de téléphone"
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Fonction</Label>
            <Input
              id="role"
              placeholder="Entrez la fonction"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Ajouter l'utilisateur
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUserForm;