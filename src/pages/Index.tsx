
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col bg-cover bg-center bg-no-fixed" style={{backgroundImage: `url('/lovable-uploads/12a6813d-455a-439d-97d4-b544ee341833.png')'}}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gold mb-6">
          Museum Guide Experience
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl">
          Discover our exhibits through interactive videos
        </p>
        <div className="space-y-4">
          <Link to="/scan">
            <Button size="lg" className="w-64 bg-gold text-black hover:bg-gold/80 flex items-center justify-center gap-2">
              <QrCode size={20} />
              Scan QR Code
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
