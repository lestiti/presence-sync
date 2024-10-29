import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

interface AttendanceCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
  };
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ user }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const cardRef = React.useRef<HTMLDivElement>(null);
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  React.useEffect(() => {
    generateQRCode();
  }, [user.id]);

  const generateQRCode = async () => {
    try {
      const qrCode = await QRCode.toDataURL(user.id);
      setQrCodeUrl(qrCode);
    } catch (error) {
      toast.error("Erreur lors de la génération du QR Code");
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `carte-presence-${user.firstName}-${user.lastName}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Carte téléchargée avec succès");
      } catch (error) {
        toast.error("Erreur lors du téléchargement de la carte");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <div ref={cardRef} className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <img src="/fpvm-logo.png" alt="FPVM Logo" className="w-16 h-16" />
          <h2 className="text-xl font-bold text-gray-800">Carte de Présence</h2>
          
          <Avatar className="w-24 h-24 border-2 border-gold">
            <AvatarImage src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
            <p className="text-xs text-gray-400">
              Expire le: {expirationDate.toLocaleDateString()}
            </p>
          </div>

          {qrCodeUrl && (
            <div className="mt-4">
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button 
          onClick={handleDownload} 
          className="w-full bg-gold hover:bg-yellow-600 text-black"
        >
          Télécharger la carte
        </Button>
      </div>
    </div>
  );
};

export default AttendanceCard;