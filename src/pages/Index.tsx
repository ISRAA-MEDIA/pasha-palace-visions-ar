
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/3603e013-56e2-48fb-bac7-640fb28a24e9.png")',
        }}
      />
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center min-h-screen">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6">
          Museum Guide Experience
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl text-white">
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
