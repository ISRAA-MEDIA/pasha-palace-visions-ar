
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  
  const handleScan = () => {
    setScanning(true);
    toast({
      title: "Scanning QR Code",
      description: "Please hold your device steady..."
    });
    
    // This would normally activate the camera for QR scanning
    // For demo purposes, we'll redirect to sample videos after a delay
    
    // Simulate scanning different exhibit QR codes
    const exhibits = ["sample", "dining", "garden", "library"];
    const randomExhibit = exhibits[Math.floor(Math.random() * exhibits.length)];
    
    setTimeout(() => {
      navigate(`/v/${randomExhibit}`);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkBg p-6 text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="font-playfair text-3xl mb-2 text-gold">Mustapha Pasha Palace</h1>
          </Link>
          <p className="text-gray-300">Scan a QR code to continue your journey</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-8 text-center fade-in">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mb-4">
              <QrCode size={48} className="text-gold" />
            </div>
            <h2 className="text-xl font-playfair mb-2">Ready to Explore?</h2>
            <p className="text-gray-300 text-sm mb-6">
              Use your device's camera to scan the QR code at each exhibit
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleScan}
              className="w-full py-3 px-6 bg-gold text-black rounded-md hover:bg-gold/80 transition-all font-medium"
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "Open Camera"}
            </button>
            
            <Link to="/" className="w-full py-3 px-6 border border-gray-600 rounded-md text-center block hover:border-gold hover:text-gold transition-all">
              Go Back
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>Point your camera at any Mustapha Pasha Palace QR code</p>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
