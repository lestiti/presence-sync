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
    <Card className="p-4 max-w-sm mx-auto">
      <div ref={cardRef} className="flex flex-col items-center space-y-4 bg-white p-4 rounded-lg">
        <img src="/fpvm-logo.png" alt="FPVM Logo" className="w-16 h-16" />
        <h2 className="text-xl font-bold">Carte de Présence</h2>
        
        <Avatar className="w-24 h-24 border-2 border-gold">
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback>
            {user.firstName[0]}{user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
          <p className="text-xs text-gray-400">
            Expire le: {expirationDate.toLocaleDateString()}
          </p>
        </div>

        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
        )}
      </div>

      <Button 
        onClick={handleDownload} 
        className="w-full mt-4"
      >
        Télécharger la carte
      </Button>
    </Card>
  );
};

export default AttendanceCard;