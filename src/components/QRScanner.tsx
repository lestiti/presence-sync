import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import jsQR from "jsqr";
import { saveAttendanceRecord } from '../utils/attendanceUtils';
import { supabase } from "@/integrations/supabase/client";
import { Camera, StopCircle } from 'lucide-react';

const QRScanner = ({ isAdmin }) => {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }

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
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [scanning]);

  const startScanning = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
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
      // Éviter les scans multiples du même code QR
      if (lastScan === qrCode && scanTimeoutRef.current) {
        return;
      }
      
      setLastScan(qrCode);
      scanTimeoutRef.current = setTimeout(() => setLastScan(null), 5000);

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
      
      // Vibrer pour confirmer le scan
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error) {
      console.error('Erreur scan:', error);
      toast.error("Erreur lors de l'enregistrement de la présence");
    }
  };

  const tick = () => {
    if (videoRef.current && canvasRef.current && scanning) {
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
          }
        }
      }
      requestAnimationFrame(tick);
    }
  };

  return (
    <div className="text-center p-4">
      <div className="relative w-full max-w-[300px] md:max-w-[400px] aspect-square mx-auto mb-6">
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
            <div className="absolute top-0 left-0 w-full h-full border-2 border-secondary rounded-lg">
              <div className="absolute inset-0 border-4 border-secondary opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-secondary"></div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center rounded-lg">
            <span className="text-muted-foreground">Scanner QR Code</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={() => setScanning(!scanning)} 
        className={`bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full md:w-auto ${scanning ? 'bg-red-500 hover:bg-red-600' : ''}`}
      >
        {scanning ? (
          <>
            <StopCircle className="mr-2 h-4 w-4" />
            Arrêter le scan
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Scanner QR Code
          </>
        )}
      </Button>
    </div>
  );
};

export default QRScanner;
