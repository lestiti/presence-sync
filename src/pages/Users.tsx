import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Header from '../components/Header';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Simulating user fetching without Supabase
    const mockUsers = [
      { id: '1', firstName: 'John', lastName: 'Doe', role: 'Admin' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', role: 'User' },
      // Add more mock users as needed
    ];
    setUsers(mockUsers);
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