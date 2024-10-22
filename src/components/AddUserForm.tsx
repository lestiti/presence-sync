import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from '../lib/supabaseClient';

const AddUserForm = ({ onUserAdded }) => {
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', phoneNumber: '', role: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('users').insert([newUser]);
    if (error) {
      toast.error('Failed to add user');
    } else {
      toast.success("User added successfully!");
      setNewUser({ firstName: '', lastName: '', phoneNumber: '', role: '' });
      onUserAdded();
    }
  };

  return (
    <form onSubmit={handleAddUser} className="space-y-4 mb-8">
      <Input
        placeholder="First Name"
        name="firstName"
        value={newUser.firstName}
        onChange={handleInputChange}
        className="bg-gray-800 text-white border-gold"
      />
      <Input
        placeholder="Last Name"
        name="lastName"
        value={newUser.lastName}
        onChange={handleInputChange}
        className="bg-gray-800 text-white border-gold"
      />
      <Input
        placeholder="Phone Number"
        name="phoneNumber"
        value={newUser.phoneNumber}
        onChange={handleInputChange}
        className="bg-gray-800 text-white border-gold"
      />
      <Input
        placeholder="Role"
        name="role"
        value={newUser.role}
        onChange={handleInputChange}
        className="bg-gray-800 text-white border-gold"
      />
      <Button type="submit" className="bg-gold text-black hover:bg-yellow-600">
        Add User
      </Button>
    </form>
  );
};

export default AddUserForm;