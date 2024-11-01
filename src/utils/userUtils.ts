import { supabase } from "@/integrations/supabase/client";

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  synode: string;
  eglise: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone_number: userData.phoneNumber,
      role: userData.role,
      synode: userData.synode,
      eglise: userData.eglise
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string) => {
  // Vérifier d'abord s'il y a des enregistrements d'assiduité liés
  const { data: attendanceRecords } = await supabase
    .from('attendance')
    .select('id')
    .eq('user_id', id);

  if (attendanceRecords && attendanceRecords.length > 0) {
    // Supprimer d'abord les enregistrements d'assiduité
    const { error: attendanceError } = await supabase
      .from('attendance')
      .delete()
      .eq('user_id', id);

    if (attendanceError) throw attendanceError;
  }

  // Ensuite, supprimer l'utilisateur
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};