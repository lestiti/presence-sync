import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { initializeStorage } from './utils/localStorage';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeStorage();
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized) {
    return <div>Initialisation du stockage...</div>;
  }

  return (
    <React.StrictMode>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </React.StrictMode>
  );
};

export default App;