import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AttendanceCard from './AttendanceCard';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  };

  const handleDeleteUser = async (id) => {
    try {
      const updatedUsers = users.filter(user => user.id !== id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          <ul className="space-y-4">
            {users.map(user => (
              <li key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-4 rounded-lg gap-4">
                <div>
                  <p className="font-bold">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                  <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Button 
                    onClick={() => setSelectedUser(user)}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    Générer carte
                  </Button>
                  <Button 
                    onClick={() => handleDeleteUser(user.id)} 
                    variant="destructive"
                    className="w-full md:w-auto"
                  >
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 max-w-lg w-full">
              <AttendanceCard 
                user={selectedUser} 
                onClose={() => setSelectedUser(null)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;