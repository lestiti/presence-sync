import { useState } from 'react';

export const useAdminAuth = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loginAdmin = (success: boolean) => {
    setIsAdminLoggedIn(success);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  return { isAdminLoggedIn, loginAdmin, logoutAdmin };
};