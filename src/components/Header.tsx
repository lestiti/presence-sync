import React from 'react';
import { Clock } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-gold p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="mr-2" />
          <h1 className="text-2xl font-bold">FPVM Checking</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-white">Accueil</a></li>
            <li><a href="/users" className="hover:text-white">Utilisateurs</a></li>
            <li><a href="/reports" className="hover:text-white">Rapports</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;