import React from 'react';
import Header from '../components/Header';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';

const Users = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AddUserForm onUserAdded={() => window.location.reload()} />
        <UserList />
      </main>
    </div>
  );
};

export default Users;