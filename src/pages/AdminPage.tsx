
import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { generateAllExhibitQRs, QRCodeData } from "../utils/qrGenerator";
import { toast } from "@/components/ui/use-toast";

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const [exhibits, setExhibits] = useState<string[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [newExhibit, setNewExhibit] = useState("");
  const [baseUrl, setBaseUrl] = useState(() => {
    // Default to current origin, but allow overriding for production deployment
    return localStorage.getItem('qr-base-url') || window.location.origin;
  });
  const [isGenerated, setIsGenerated] = useState(false);
  
  const exhibitInputRef = useRef<HTMLInputElement>(null);

  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Save baseUrl to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('qr-base-url', baseUrl);
  }, [baseUrl]);

  const handleSignOut = async () => {
    await signOut();
  };

  const addExhibit = () => {
    if (newExhibit && !exhibits.includes(newExhibit)) {
      setExhibits([...exhibits, newExhibit]);
      setNewExhibit("");
      exhibitInputRef.current?.focus();
    }
  };
  
  const removeExhibit = (index: number) => {
    const updated = [...exhibits];
    updated.splice(index, 1);
    setExhibits(updated);
  };
  
  const generateQRCodes = () => {
    if (exhibits.length > 0) {
      const generated = generateAllExhibitQRs(exhibits, baseUrl);
      setQrCodes(generated);
      setIsGenerated(true);
      toast({
        title: "QR Codes Generated",
        description: `Created ${exhibits.length} QR code URLs using base URL: ${baseUrl}`,
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-darkBg text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-gold">QR Code Management</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-gold">Back to Home</Link>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="bg-black/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl mb-4">Configure Your Exhibits</h2>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">Base URL (your website)</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
              placeholder="https://yourdomain.com"
            />
            <p className="text-xs text-amber-400 mt-1">
              Important: Make sure this matches your deployed site URL for QR codes to work in production
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">Add Exhibit ID</label>
            <div className="flex gap-2">
              <input
                ref={exhibitInputRef}
                type="text"
                value={newExhibit}
                onChange={(e) => setNewExhibit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addExhibit()}
                className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded text-white"
                placeholder="e.g., grand-hall"
              />
              <button 
                onClick={addExhibit}
                className="bg-gold text-black px-4 py-2 rounded hover:bg-gold/80"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Enter a unique ID for each exhibit location. This will be used in the QR code URL.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg mb-2">Your Exhibits:</h3>
            {exhibits.length === 0 ? (
              <p className="text-gray-400 italic">No exhibits added yet</p>
            ) : (
              <ul className="space-y-2">
                {exhibits.map((exhibit, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                    <span>{exhibit}</span>
                    <button 
                      onClick={() => removeExhibit(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <button 
            onClick={generateQRCodes}
            disabled={exhibits.length === 0}
            className={`w-full py-3 ${exhibits.length > 0 ? "bg-gold text-black hover:bg-gold/80" : "bg-gray-700 text-gray-300 cursor-not-allowed"} rounded font-medium`}
          >
            Generate QR Code URLs
          </button>
        </div>
        
        {isGenerated && (
          <div className="bg-black/30 rounded-xl p-6 fade-in">
            <h2 className="text-xl mb-4">Your QR Code URLs</h2>
            <p className="text-sm text-gray-300 mb-4">
              Copy these URLs and use a QR code generator to create QR codes for each exhibit.
            </p>
            
            <div className="space-y-4">
              {qrCodes.map((qr, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-gold">{qr.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">URL for QR code:</p>
                  <div className="bg-gray-900 p-3 rounded-sm break-all">
                    {qr.url}
                  </div>
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(qr.url);
                        toast({
                          title: "URL Copied",
                          description: "QR code URL copied to clipboard",
                        });
                      }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Use a QR code generator service like{" "}
                <a href="https://www.qr-code-generator.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  QR Code Generator
                </a>
                {" "}to create images from these URLs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
