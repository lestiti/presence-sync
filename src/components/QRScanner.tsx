import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import jsQR from "jsqr";
import { generateMonthlyReport } from '../utils/reportUtils';

const QRScanner = ({ isAdmin }) => {
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [scanning]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra:", err);
      toast.error("Impossible d'accéder à la caméra");
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleScan = async (qrCode: string) => {
    const timestamp = new Date().toISOString();
    if (isAdmin && qrCode === 'ADMIN_QR_CODE') {
      const report = await generateMonthlyReport();
      // Ici, vous devriez implémenter la logique pour télécharger le rapport
      console.log('Rapport mensuel généré:', report);
      toast.success('Rapport mensuel téléchargé');
    } else {
      // Simuler l'enregistrement de l'horodatage
      console.log(`QR Code scanné: ${qrCode}, Horodatage: ${timestamp}`);
      toast.success(`Présence enregistrée pour l'utilisateur ${qrCode}`);
    }
    setScanning(false);
  };

  const tick = () => {
    if (videoRef.current && canvasRef.current) {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvasRef.current.height = videoRef.current.videoHeight;
        canvasRef.current.width = videoRef.current.videoWidth;
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            console.log("QR Code détecté", code.data);
            handleScan(code.data);
            return;
          }
        }
      }
      requestAnimationFrame(tick);
    }
  };

  const toggleScanning = () => {
    setScanning(!scanning);
  };

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-between items-center">
        <img src="/fpvm-logo.png" alt="FPVM Logo" className="w-16 h-16 mx-auto object-cover" />
        {scanning ? (
          <div className="relative w-64 h-64 mx-auto">
            <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" style={{ display: 'none' }} />
            <div className="absolute top-0 left-0 w-full h-full border-2 border-secondary"></div>
          </div>
        ) : (
          <div className="w-64 h-64 mx-auto bg-primary flex items-center justify-center">
            <span className="text-muted-foreground">QR Code Scanner</span>
          </div>
        )}
        <img src="/fpvm-logo.png" alt="FPVM Logo" className="w-16 h-16 mx-auto object-cover" />
      </div>
      <Button onClick={toggleScanning} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        {scanning ? 'Arrêter le scan' : 'Scanner QR Code'}
      </Button>
    </div>
  );
};

export default QRScanner;