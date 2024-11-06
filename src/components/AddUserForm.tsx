import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createUser } from '../utils/userUtils';
import FormField from './FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const roles = [
    "Pasteur",
    "Ancien",
    "Diacre",
    "Membre",
    "Visiteur"
  ];

  const synodes = [
    "Synode Nord",
    "Synode Sud",
    "Synode Est",
    "Synode Ouest",
    "Synode Central"
  ];

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

    if (!newUser.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    }

    if (!newUser.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    }

    if (!newUser.role) {
      newErrors.role = 'La fonction est requise';
      isValid = false;
    }

    if (!newUser.synode) {
      newErrors.synode = 'Le synode est requis';
      isValid = false;
    }

    if (!newUser.eglise.trim()) {
      newErrors.eglise = "L'église est requise";
      isValid = false;
    }

    if (newUser.phoneNumber && !/^(\+[0-9]{1,3})?[0-9]{9,}$/.test(newUser.phoneNumber)) {
      newErrors.phoneNumber = 'Format de numéro invalide (ex: +261XXXXXXXXX)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewUser(prev => ({ ...prev, [name]: value }));
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
              placeholder="+261XXXXXXXXX"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">Fonction *</label>
              <Select value={newUser.role} onValueChange={(value) => handleSelectChange('role', value)}>
                <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez une fonction" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="synode" className="block text-sm font-medium">Synode *</label>
              <Select value={newUser.synode} onValueChange={(value) => handleSelectChange('synode', value)}>
                <SelectTrigger id="synode" className={errors.synode ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez un synode" />
                </SelectTrigger>
                <SelectContent>
                  {synodes.map((synode) => (
                    <SelectItem key={synode} value={synode}>{synode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.synode && <p className="text-red-500 text-sm">{errors.synode}</p>}
            </div>

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