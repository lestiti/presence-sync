import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserList = ({ users, onUserDeleted }) => {
  const handleDeleteUser = async (id) => {
    // Simulating user deletion without Supabase
    console.log('Deleting user:', id);
    toast.success("User deleted successfully!");
    onUserDeleted();
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