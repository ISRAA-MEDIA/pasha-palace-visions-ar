
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { VIDEOS_CONFIG } from "@/config/videos";
import { generateSecureToken } from "@/utils/qrGenerator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GenerateQRPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  
  const generateQRUrl = (videoId: string) => {
    const token = generateSecureToken(videoId);
    return `v/${videoId}/${token}`;
  };
  
  return (
    <div className="min-h-screen bg-darkBg text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-playfair text-gold">Generate QR Codes</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        
        <div className="space-y-8">
          <div className="grid gap-4">
            {Object.entries(VIDEOS_CONFIG).map(([id, config]) => (
              <button
                key={id}
                onClick={() => setSelectedVideo(id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  selectedVideo === id ? 'bg-gold/20 border border-gold' : 'bg-black/30 hover:bg-black/50'
                }`}
              >
                <h3 className="font-playfair text-lg mb-1">{config.title}</h3>
                <p className="text-sm text-gray-400">{config.description}</p>
              </button>
            ))}
          </div>
          
          {selectedVideo && (
            <div className="bg-black/30 p-6 rounded-lg flex flex-col items-center">
              <h2 className="text-xl font-playfair mb-4 text-gold">
                QR Code for {VIDEOS_CONFIG[selectedVideo].title}
              </h2>
              <div className="bg-white p-2 rounded-lg inline-block w-40 h-40 flex items-center justify-center">
                <QRCodeSVG
                  value={generateQRUrl(selectedVideo)}
                  size={128}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">
                Scan this QR code to view the video on a mobile device
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
