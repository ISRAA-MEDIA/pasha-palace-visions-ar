
/**
 * QR Code Generation Utility
 * 
 * This file provides a central place to generate secure QR codes for museum exhibits.
 * In a production environment, you would:
 * 1. Generate these server-side with proper validation
 * 2. Store mappings between exhibit IDs and videos in a database
 * 3. Create time-limited, signed tokens for security
 */

// For a real implementation, use a JWT library
const generateSecureToken = (videoId: string, expiryHours = 24): string => {
  // In a real app, you'd use proper JWT signing with a secret key
  // This is just a placeholder to demonstrate the concept
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    vid: videoId,
    exp: Date.now() + (expiryHours * 60 * 60 * 1000)
  }));
  
  // In reality, you'd use a proper signature
  const signature = "SAMPLE_SIGNATURE"; 
  
  return `${header}.${payload}.${signature}`;
};

export interface QRCodeData {
  videoId: string;
  title: string;
  url: string;
}

export const generateExhibitQRData = (
  exhibitId: string,
  baseUrl: string = window.location.origin
): QRCodeData => {
  const token = generateSecureToken(exhibitId);
  const url = `${baseUrl}/video/${exhibitId}?token=${token}`;
  
  return {
    videoId: exhibitId,
    title: `Exhibit: ${exhibitId}`,
    url: url
  };
};

/**
 * Administrator tool to generate QR codes for all exhibits
 * In a real app, this would be protected behind authentication
 */
export const generateAllExhibitQRs = (
  exhibitIds: string[],
  baseUrl: string = window.location.origin
): QRCodeData[] => {
  return exhibitIds.map(id => generateExhibitQRData(id, baseUrl));
};

/**
 * For museum administrators:
 * To generate QR codes for your exhibits, use the following code:
 * 
 * ```
 * import { generateExhibitQRData } from './utils/qrGenerator';
 * 
 * // Generate QR data for a specific exhibit
 * const qrData = generateExhibitQRData('grand-hall');
 * console.log(qrData.url); // URL to encode in the QR code
 * ```
 * 
 * Then use a QR code generator library or service to create the actual image
 * with the URL encoded.
 */
