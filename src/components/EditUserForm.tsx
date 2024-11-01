import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface EditUserFormProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
    synode: string;
    eglise: string;
  };
  onSuccess: () => void;
}

const EditUserForm = ({ user, onSuccess }: EditUserFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      role: user.role,
      synode: user.synode,
      eglise: user.eglise,
    }
  });

  const updateUser = async (data: any) => {
    const { error } = await supabase
      .from('users')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: data.role,
        synode: data.synode,
        eglise: data.eglise,
      })
      .eq('id', user.id);

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Utilisateur modifié avec succès");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification de l'utilisateur");
      console.error('Error updating user:', error);
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          {...register("firstName", { required: "Le prénom est requis" })}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          {...register("lastName", { required: "Le nom est requis" })}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          {...register("phoneNumber", { 
            pattern: {
              value: /^[0-9+\s-]*$/,
              message: "Veuillez entrer un numéro de téléphone valide"
            }
          })}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Fonction</Label>
        <Input
          id="role"
          {...register("role", { required: "La fonction est requise" })}
        />
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="synode">Synode</Label>
        <Input
          id="synode"
          {...register("synode", { required: "Le synode est requis" })}
        />
        {errors.synode && (
          <p className="text-red-500 text-sm">{errors.synode.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eglise">Église</Label>
        <Input
          id="eglise"
          {...register("eglise", { required: "L'église est requise" })}
        />
        {errors.eglise && (
          <p className="text-red-500 text-sm">{errors.eglise.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Modification en cours...' : 'Modifier'}
      </Button>
    </form>
  );
};

export default EditUserForm;