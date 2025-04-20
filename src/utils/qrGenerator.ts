
export interface QRCodeData {
  videoId: string;
  title: string;
  url: string;
}

export const generateExhibitQRData = (
  exhibitId: string,
  baseUrl: string = window.location.origin
): QRCodeData => {
  const url = `${baseUrl}/v/${exhibitId}`;
  
  return {
    videoId: exhibitId,
    title: `Exhibit: ${exhibitId}`,
    url: url
  };
};

export const generateAllExhibitQRs = (
  exhibitIds: string[],
  baseUrl: string = window.location.origin
): QRCodeData[] => {
  return exhibitIds.map(id => generateExhibitQRData(id, baseUrl));
};
