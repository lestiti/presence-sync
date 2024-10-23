import QRCode from 'qrcode';
import { toast } from "sonner";
import { saveAttendanceRecord } from './attendanceUtils';

export const generateQRCode = async (userId: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(userId);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const processQRCode = (qrCode: string) => {
  try {
    const record = saveAttendanceRecord(qrCode, 'check-in');
    toast.success(`Présence enregistrée avec succès`);
  } catch (error) {
    toast.error("Erreur lors de l'enregistrement de la présence");
    console.error('Erreur scan:', error);
  }
};