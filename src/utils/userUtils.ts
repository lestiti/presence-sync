import { supabase } from "@/integrations/supabase/client";

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone_number: userData.phoneNumber,
      role: userData.role
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
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};