import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
      <li><a href="/" className="hover:text-white block transition-colors">Accueil</a></li>
      <li><a href="/users" className="hover:text-white block transition-colors">Utilisateurs</a></li>
      <li><a href="/reports" className="hover:text-white block transition-colors">Rapports</a></li>
    </ul>
  );

  return (
    <header className="bg-gray-900 text-gold p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">FPVM Checking</h1>
        
        <nav className="hidden md:flex items-center">
          <NavLinks />
          {deferredPrompt && (
            <Button onClick={handleInstall} variant="outline" size="sm" className="ml-8">
              Installer l'app
            </Button>
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col mt-8">
              <NavLinks />
              {deferredPrompt && (
                <Button onClick={handleInstall} variant="outline" size="sm" className="mt-4">
                  Installer l'app
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;