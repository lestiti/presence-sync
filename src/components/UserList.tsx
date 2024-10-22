import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '../lib/supabaseClient';

const UserList = ({ users, onUserDeleted }) => {
  const handleDeleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete user');
    } else {
      toast.success("User deleted successfully!");
      onUserDeleted();
    }
  };

  return (
    <ul className="space-y-4">
      {users.map(user => (
        <li key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded">
          <div>
            <p className="font-bold">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-400">{user.role}</p>
          </div>
          <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;