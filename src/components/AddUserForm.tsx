import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createUser } from '../utils/userUtils';

const AddUserForm = () => {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: ''
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Utilisateur ajouté avec succès!");
      setNewUser({ firstName: '', lastName: '', phoneNumber: '', role: '' });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout de l'utilisateur");
      console.error('Error adding user:', error);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    createUserMutation.mutate(newUser);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouvel utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending ? 'Ajout en cours...' : 'Ajouter l\'utilisateur'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUserForm;