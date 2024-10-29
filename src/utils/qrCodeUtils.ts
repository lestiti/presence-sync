import QRCode from 'qrcode';

export const generateQRCode = async (userId: string): Promise<string> => {
  try {
    // Génère un QR code qui contient l'ID de l'utilisateur
    const qrCodeDataUrl = await QRCode.toDataURL(userId, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};