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

  // Generate a data URL for a QR code
  function generateQRDataUrl(value: string) {
    // Create a canvas element to draw the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 200; // Size of the QR code
    
    canvas.width = size;
    canvas.height = size;
    
    if (ctx) {
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      
      // Create a temporary container to render the QR code
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      
      // Render the QR code to the container
      const qrRoot = document.createElement('div');
      tempContainer.appendChild(qrRoot);
      
      // Use ReactDOM to render the QRCodeSVG component to the temporary container
      const ReactDOM = require('react-dom');
      ReactDOM.render(
        <QRCodeSVG
          value={value}
          size={size - 20}
          level="H"
          includeMargin={true}
        />,
        qrRoot
      );
      
      // Get the SVG element
      const svg = qrRoot.querySelector('svg');
      
      if (svg) {
        // Convert SVG to a data URL
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });
        
        // Draw the SVG to the canvas
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 10, 10);
        };
        img.src = URL.createObjectURL(svgBlob);
      }
      
      // Clean up
      document.body.removeChild(tempContainer);
    }
    
    // Return the data URL
    return canvas.toDataURL('image/png');
  }

  // Download all QR codes as ZIP
  const handleDownloadAllQRCodes = async () => {
    const zip = new JSZip();
    const qrFolder = zip.folder("qr-codes");
    
    for (const [id] of Object.entries(VIDEOS_CONFIG)) {
      const url = `${window.location.origin}/${generateQRUrl(id)}`;
      
      // Create a QR code SVG using the library directly
      const svgElement = document.createElement('div');
      document.body.appendChild(svgElement);
      
      const ReactDOM = require('react-dom');
      ReactDOM.render(
        <QRCodeSVG 
          value={url}
          size={200}
          level="H"
          includeMargin={true}
          style={{ background: 'white', padding: '10px' }}
        />, 
        svgElement
      );
      
      // Convert the SVG to a string properly
      const svg = svgElement.querySelector('svg');
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svg);
      
      // Clean up DOM
      document.body.removeChild(svgElement);
      
      // Add title inside the SVG properly
      svgString = svgString.replace('</svg>', `<text x="100" y="220" text-anchor="middle" font-size="12" fill="#666">Exhibit: ${id}</text></svg>`);
      
      // Add the SVG to the zip file
      if (qrFolder) {
        qrFolder.file(`${id}.svg`, svgString);
      }
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
