import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import html2canvas from 'html2canvas';

interface AttendanceCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    role: string;
  };
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ user }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    generateQRCode();
  }, [user.id]);

  const generateQRCode = async () => {
    try {
      const QRCode = await import('qrcode');
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
    <div className="max-w-sm mx-auto">
      <div ref={cardRef} className="relative bg-white rounded-lg shadow-md overflow-hidden">
        {/* Vagues du haut */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500">
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 320" className="w-full">
              <path fill="white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        <div className="relative pt-8 px-6 pb-6">
          {/* Photo de profil */}
          <div className="flex justify-center mb-8">
            <Avatar className="w-32 h-32 border-4 border-blue-700 shadow-lg">
              <AvatarImage src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Informations */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-wider text-gray-800">
              {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
            </h2>
            <p className="text-xl text-gray-600 uppercase tracking-wide">{user.role}</p>
            
            {/* QR Code */}
            {qrCodeUrl && (
              <div className="mt-6 mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
              </div>
            )}
            
            <p className="text-lg text-gray-500 font-light tracking-wider">
              ID NO. {user.id}
            </p>
          </div>
        </div>

        {/* Vagues du bas */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900 via-blue-700 to-blue-500">
          <div className="absolute top-0 left-0 right-0 transform rotate-180">
            <svg viewBox="0 0 1440 320" className="w-full">
              <path fill="white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button 
          onClick={handleDownload} 
          className="w-full bg-blue-700 hover:bg-blue-800 text-white"
        >
          Télécharger la carte
        </Button>
      </div>
    </div>
  );
};

export default AttendanceCard;