import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import jsQR from "jsqr";
import { processQRCode } from '../utils/qrCodeUtils';

const QRScanner = ({ isAdmin = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const toggleScanning = () => {
    setScanning(prev => !prev);
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (scanning) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.play();
          requestAnimationFrame(tick);
        });
    } else {
      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      video.srcObject = null;
    }

    const tick = () => {
      if (scanning) {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            processQRCode(code.data);
            toggleScanning();
          }
        }
        requestAnimationFrame(tick);
      }
    };
  }, [scanning]);

  return (
    <div className="text-center p-4">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <img src="/fpvm-logo.png" alt="FPVM Logo" className="w-16 h-16 object-cover" />
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
        <img src="/fpvm-logo.png" alt="FPVM Logo" className="w-16 h-16 object-cover" />
      </div>
      <Button 
        onClick={toggleScanning} 
        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full md:w-auto"
      >
        {scanning ? 'Arrêter le scan' : 'Scanner QR Code'}
      </Button>
    </div>
  );
};

export default QRScanner;
