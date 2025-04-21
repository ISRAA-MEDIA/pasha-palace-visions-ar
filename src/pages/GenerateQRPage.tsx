
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { VIDEOS_CONFIG } from "@/config/videos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const GenerateQRPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const generateQRUrl = (videoId: string) => `v/${videoId}`;

  const handleCopyQRCode = (videoId: string) => {
    const qrUrl = generateQRUrl(videoId);
    navigator.clipboard.writeText(`${window.location.origin}/${qrUrl}`).then(() => {
      toast({
        title: "QR Code URL Copied",
        description: "The full QR code URL has been copied to clipboard.",
      });
    });
  };

  // Util to render SVG QR code markup as a string for given id and url
  function generateQRCodeSvgString(value: string, title: string) {
    // Leverage QRCodeSVG component and render to string
    // Since QRCodeSVG is not server renderable, use static SVG template
    const encoded = encodeURIComponent(value);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
        <foreignObject width="128" height="128">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:128px;height:128px;background:white;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encoded}" width="128" height="128" alt="QR"/>
            <div style="font-size:10px;color:#888;text-align:center;width:100%">${title}</div>
          </div>
        </foreignObject>
      </svg>
    `;
  }

  // Download all QR codes as ZIP
  const handleDownloadAllQRCodes = async () => {
    const zip = new JSZip();
    for (const [id] of Object.entries(VIDEOS_CONFIG)) {
      const url = `${window.location.origin}/${generateQRUrl(id)}`;
      const title = `Exhibit: ${id}`;
      const svgContent = generateQRCodeSvgString(url, title);
      zip.file(`${id}.svg`, svgContent);
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "qr-codes.zip");
    toast({
      title: "Download Started",
      description: "Downloading all QR codes in a zip file.",
    });
  };

  return (
    <div className="min-h-screen bg-darkBg text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-playfair text-gold">Generate QR Codes</h1>
          <div className="flex gap-2 items-center">
            <Button onClick={handleDownloadAllQRCodes} variant="secondary">
              Download All QRs
            </Button>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
        <div className="space-y-8">
          <div className="grid gap-4">
            {Object.entries(VIDEOS_CONFIG).map(([id, config]) => (
              <div
                key={id}
                className={`p-4 rounded-lg text-left transition-all flex justify-between items-center ${
                  selectedVideo === id
                    ? "bg-gold/20 border border-gold"
                    : "bg-black/30 hover:bg-black/50"
                }`}
              >
                <div onClick={() => setSelectedVideo(id)} className="cursor-pointer flex-grow">
                  <h3 className="font-playfair text-lg mb-1">{`Exhibit: ${id}`}</h3>
                  <p className="text-sm text-gray-400">{`QR code for exhibit ${id}`}</p>
                </div>
                {selectedVideo === id && (
                  <Button variant="secondary" size="sm" onClick={() => handleCopyQRCode(id)}>
                    Copy QR URL
                  </Button>
                )}
              </div>
            ))}
          </div>
          {selectedVideo && (
            <div className="bg-black/30 p-6 rounded-lg flex flex-col items-center">
              <h2 className="text-xl font-playfair mb-4 text-gold">
                QR Code for {`Exhibit: ${selectedVideo}`}
              </h2>
              <div className="bg-white p-2 rounded-lg inline-block w-40 h-40 flex items-center justify-center">
                <QRCodeSVG
                  value={`${window.location.origin}/${generateQRUrl(selectedVideo)}`}
                  size={128}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">Scan this QR code to view the video</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
