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
    const newErrors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: '',
      synode: '',
      eglise: ''
    };

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

    if (newUser.phoneNumber && !/^[0-9+\s-]*$/.test(newUser.phoneNumber)) {
      newErrors.phoneNumber = 'Numéro de téléphone invalide';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddUser = async (e) => {
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
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                placeholder="Entrez le prénom"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                placeholder="Entrez le nom"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                placeholder="Entrez le numéro de téléphone"
                name="phoneNumber"
                value={newUser.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Fonction</Label>
              <Input
                id="role"
                placeholder="Entrez la fonction"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className={errors.role ? "border-red-500" : ""}
              />
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="synode">Synode</Label>
              <Input
                id="synode"
                placeholder="Entrez le synode"
                name="synode"
                value={newUser.synode}
                onChange={handleInputChange}
                className={errors.synode ? "border-red-500" : ""}
              />
              {errors.synode && (
                <p className="text-red-500 text-sm">{errors.synode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eglise">Église</Label>
              <Input
                id="eglise"
                placeholder="Entrez l'église"
                name="eglise"
                value={newUser.eglise}
                onChange={handleInputChange}
                className={errors.eglise ? "border-red-500" : ""}
              />
              {errors.eglise && (
                <p className="text-red-500 text-sm">{errors.eglise}</p>
              )}
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