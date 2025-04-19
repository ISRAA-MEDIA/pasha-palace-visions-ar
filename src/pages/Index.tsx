
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <div className="h-screen w-full bg-darkBg overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-200" 
        style={{ 
          backgroundImage: "url('/museum-background.jpg')", 
          filter: "brightness(0.4)" 
        }}
      ></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
        <div className="text-6xl mb-4">🏛️</div>
        <h1 className="font-playfair text-4xl md:text-5xl tracking-wider mb-2 text-white" 
          style={{ textShadow: "0 0 10px rgba(212, 175, 55, 0.8)" }}>
          Mustapha Pasha Palace
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mt-2">
          A digital window into Algeria&apos;s hidden elegance
        </p>
        
        <div className="mt-16">
          <Link to="/scan" className="bg-transparent border-2 border-gold px-6 py-3 rounded-md text-gold hover:bg-gold hover:text-darkBg transition-all duration-300">
            Scan a QR Code
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
