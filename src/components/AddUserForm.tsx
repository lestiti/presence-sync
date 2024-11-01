import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createUser } from '../utils/userUtils';
import FormField from './FormField';

const AddUserForm = () => {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    synode: '',
    eglise: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    synode: '',
    eglise: ''
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Utilisateur ajouté avec succès!");
      setNewUser({ firstName: '', lastName: '', phoneNumber: '', role: '', synode: '', eglise: '' });
      setErrors({ firstName: '', lastName: '', phoneNumber: '', role: '', synode: '', eglise: '' });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout de l'utilisateur");
      console.error('Error adding user:', error);
    }
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Vérification des champs obligatoires
    if (!newUser.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    }

    if (!newUser.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    }

    if (!newUser.role.trim()) {
      newErrors.role = 'La fonction est requise';
      isValid = false;
    }

    if (!newUser.synode.trim()) {
      newErrors.synode = 'Le synode est requis';
      isValid = false;
    }

    if (!newUser.eglise.trim()) {
      newErrors.eglise = "L'église est requise";
      isValid = false;
    }

    // Validation du numéro de téléphone si fourni
    if (newUser.phoneNumber && !/^[0-9+\s-]*$/.test(newUser.phoneNumber)) {
      newErrors.phoneNumber = 'Numéro de téléphone invalide';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createUserMutation.mutate(newUser);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouvel utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="firstName"
              label="Prénom"
              placeholder="Entrez le prénom"
              value={newUser.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              required
            />
            
            <FormField
              id="lastName"
              label="Nom"
              placeholder="Entrez le nom"
              value={newUser.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              required
            />
            
            <FormField
              id="phoneNumber"
              label="Numéro de téléphone"
              placeholder="Entrez le numéro de téléphone"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />
            
            <FormField
              id="role"
              label="Fonction"
              placeholder="Entrez la fonction"
              value={newUser.role}
              onChange={handleInputChange}
              error={errors.role}
              required
            />

            <FormField
              id="synode"
              label="Synode"
              placeholder="Entrez le synode"
              value={newUser.synode}
              onChange={handleInputChange}
              error={errors.synode}
              required
            />

            <FormField
              id="eglise"
              label="Église"
              placeholder="Entrez l'église"
              value={newUser.eglise}
              onChange={handleInputChange}
              error={errors.eglise}
              required
            />
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