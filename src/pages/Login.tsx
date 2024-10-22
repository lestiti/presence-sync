import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulating login without Supabase
    console.log('Login attempted');
    toast.success("Login successful!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 bg-white p-8 rounded shadow">
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default Login;