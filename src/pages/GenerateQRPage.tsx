
import { useState } from "react";
import { VIDEOS_CONFIG } from "@/config/videos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const GenerateQRPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  
  return (
    <div className="min-h-screen bg-black/50 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-playfair text-gold">Museum Exhibits</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        
        <div className="space-y-8">
          <div className="grid gap-4">
            {Object.entries(VIDEOS_CONFIG).map(([id, config]) => (
              <div 
                key={id} 
                className={`p-4 rounded-lg text-left transition-all flex justify-between items-center ${
                  selectedVideo === id ? 'bg-gold/20 border border-gold' : 'bg-black/30 hover:bg-black/50'
                }`}
                onClick={() => setSelectedVideo(id)}
              >
                <div className="cursor-pointer flex-grow">
                  <h3 className="font-playfair text-lg mb-1">{config.title}</h3>
                  <p className="text-sm text-gray-400">{config.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
