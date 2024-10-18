import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulons un scan réussi après 2 secondes
    setTimeout(() => {
      setScanning(false);
      toast.success("Pointage enregistré avec succès !");
    }, 2000);
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        {scanning ? (
          <div className="w-64 h-64 mx-auto bg-gray-700 flex items-center justify-center">
            <span className="text-gold animate-pulse">Scanning...</span>
          </div>
        ) : (
          <div className="w-64 h-64 mx-auto bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500">QR Code Scanner</span>
          </div>
        )}
      </div>
      <Button onClick={handleScan} disabled={scanning} className="bg-gold text-black hover:bg-yellow-600">
        {scanning ? 'Scanning...' : 'Scanner QR Code'}
      </Button>
    </div>
  );
};

export default QRScanner;