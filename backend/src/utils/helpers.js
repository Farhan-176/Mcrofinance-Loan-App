const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(data));
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

const generateTokenNumber = () => {
  const prefix = 'SWF';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

module.exports = { generateQRCode, generateTokenNumber };
