import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import jsQR from "jsqr";
import { saveAttendanceRecord } from '../utils/attendanceUtils';
import { supabase } from "@/integrations/supabase/client";

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

    // Souscrire aux changements en temps réel
    const subscription = supabase
      .channel('attendance_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'attendance' 
        }, 
        payload => {
          console.log('Changement détecté:', payload);
          // Vous pouvez ajouter ici une logique pour mettre à jour l'interface utilisateur
          // par exemple, rafraîchir une liste ou afficher une notification
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
    try {
      // Vérifier la dernière action de l'utilisateur
      const { data: lastRecord } = await supabase
        .from('attendance')
        .select('type')
        .eq('user_id', qrCode)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      const type = !lastRecord || lastRecord.type === 'check-out' ? 'check-in' : 'check-out';
      const record = await saveAttendanceRecord(qrCode, type);
      
      toast.success(`${type === 'check-in' ? 'Entrée' : 'Sortie'} enregistrée avec succès`);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la présence");
      console.error('Erreur scan:', error);
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
            handleScan(code.data);
            return;
          }
        }
      }
      if (scanning) {
        requestAnimationFrame(tick);
      }
    }
  };

  return (
    <div className="text-center p-4">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="rounded-full overflow-hidden w-16 h-16 border-2 border-secondary flex items-center justify-center bg-white">
          <img src="fpvm-logo.png" alt="FPVM Logo" className="w-14 h-14 object-contain" />
        </div>
        
        <div className="relative w-full max-w-[300px] md:max-w-[400px] aspect-square mx-auto">
          {scanning ? (
            <>
              <video 
                ref={videoRef} 
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full" 
                style={{ display: 'none' }} 
              />
              <div className="absolute top-0 left-0 w-full h-full border-2 border-secondary rounded-lg"></div>
            </>
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center rounded-lg">
              <span className="text-muted-foreground">QR Code Scanner</span>
            </div>
          )}
        </div>

        <div className="rounded-full overflow-hidden w-16 h-16 border-2 border-secondary flex items-center justify-center bg-white">
          <img src="fpvm-logo.png" alt="FPVM Logo" className="w-14 h-14 object-contain" />
        </div>
      </div>
      <Button 
        onClick={() => setScanning(!scanning)} 
        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full md:w-auto"
      >
        {scanning ? 'Arrêter le scan' : 'Scanner QR Code'}
      </Button>
    </div>
  );
};

export default QRScanner;