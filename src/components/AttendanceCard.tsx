import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    width: '85mm',
    height: '54mm',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 5,
    border: '1px solid #FFD700',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  userInfo: {
    marginTop: 10,
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 10,
    color: '#666666',
  },
  expiration: {
    fontSize: 8,
    color: '#999999',
    marginTop: 5,
  },
});

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

  const PDFDocument = () => (
    <Document>
      <Page size={[241, 153]} style={styles.page}>
        <View style={styles.header}>
          <Image src="/fpvm-logo.png" style={styles.logo} />
          <Text style={styles.title}>Carte de Présence</Text>
        </View>
        <View style={styles.content}>
          <Image 
            src={user.photoUrl || '/default-avatar.png'} 
            style={styles.photo} 
          />
          <Image src={qrCodeUrl} style={styles.qrCode} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userId}>ID: {user.id}</Text>
          <Text style={styles.expiration}>
            Expire le: {expirationDate.toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <Card className="p-4 max-w-sm mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24 border-2 border-gold">
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback>
            {user.firstName[0]}{user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>

        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
        )}

        <PDFDownloadLink 
          document={<PDFDocument />} 
          fileName={`carte-presence-${user.firstName}-${user.lastName}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading} className="w-full">
              {loading ? "Génération..." : "Télécharger la carte"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </Card>
  );
};

export default AttendanceCard;