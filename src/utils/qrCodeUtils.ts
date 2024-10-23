import QRCode from 'qrcode';

export const generateQRCode = async (userId: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(userId);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};