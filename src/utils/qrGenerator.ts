/**
 * QR Code Generation Utility
 * 
 * This file provides utilities to generate secure QR codes for museum exhibits.
 */

// A secure token generation function that simulates JWT
export const generateSecureToken = (
  videoId: string, 
  expiryHours = 24, 
  salt = ''
): string => {
  // Create a header (in a real JWT this would be algorithm info)
  const header = btoa(JSON.stringify({ 
    alg: "HS256", 
    typ: "JWT", 
    salt: salt 
  }));
  
  // Create a payload with the video ID and expiration time
  const payload = btoa(JSON.stringify({
    vid: videoId,
    exp: Date.now() + (expiryHours * 60 * 60 * 1000),
    salt: salt
  }));
  
  // In a real app, you'd create a proper signature with a secret key
  // Here we're just demonstrating the concept
  const signature = btoa(`${header}.${payload}.SECRET_KEY`);
  
  return `${header}.${payload}.${signature}`;
};

export const generateRotatingToken = (
  videoId: string, 
  rotationPeriod: number = 24 // hours
): string => {
  // Use a consistent salt based on the current rotation period
  const currentRotationWindow = Math.floor(Date.now() / (rotationPeriod * 60 * 60 * 1000));
  
  // Generate a token that changes predictably every rotation period
  const token = generateSecureToken(
    videoId, 
    rotationPeriod, 
    `rotation_salt_${currentRotationWindow}`
  );
  
  return token;
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
 * Generate QR codes for all exhibits
 */
export const generateAllExhibitQRs = (
  exhibitIds: string[],
  baseUrl: string = window.location.origin
): QRCodeData[] => {
  return exhibitIds.map(id => generateExhibitQRData(id, baseUrl));
};

/**
 * Security notes:
 * 
 * This implementation provides a basic level of security:
 * 1. Each QR code contains a time-limited token (expires in 24 hours by default)
 * 2. Tokens are specific to a single exhibit/video
 * 3. The token structure mimics JWT for easy upgrade to real JWT later
 * 
 * For enhanced security in production:
 * - Use a proper JWT library with a secure secret key
 * - Generate QR codes on a protected server, not client-side
 * - Implement rate limiting for token verification
 * - Consider adding IP-based restrictions or geofencing
 * - Add user authentication for premium or restricted exhibits
 */
