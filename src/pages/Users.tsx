import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';
import { useSession } from '@supabase/auth-helpers-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [session, navigate]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      toast.error('Failed to fetch users');
    } else {
      setUsers(data);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AddUserForm onUserAdded={fetchUsers} />
        <UserList users={users} onUserDeleted={fetchUsers} />
      </main>
    </div>
  );
};

export default Users;