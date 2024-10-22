import React, { useState, useEffect } from 'react';
import { Clock, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Header = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success('Application installée avec succès !');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <header className="bg-gray-900 text-gold p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="mr-2" />
          <h1 className="text-2xl font-bold">FPVM Checking</h1>
        </div>
        <nav className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li><a href="/" className="hover:text-white">Accueil</a></li>
            <li><a href="/users" className="hover:text-white">Utilisateurs</a></li>
            <li><a href="/reports" className="hover:text-white">Rapports</a></li>
          </ul>
          {deferredPrompt && (
            <Button onClick={handleInstall} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Installer l'app
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;