
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VIDEOS_CONFIG } from "@/config/videos";
import { useState } from "react";

interface LanguageSelectorProps {
  videoId: string;
}

const languages = [
  { code: "ar", name: "العربية", suffix: "-ar" },   // Arabic first
  { code: "en", name: "English", suffix: "-en" },   // English second
  { code: "fr", name: "Français", suffix: "-fr" },  // French third
];

const LanguageSelector = ({ videoId }: LanguageSelectorProps) => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const videoConfig = VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG];
  
  const handleLanguageSelect = (langSuffix: string) => {
    setSelectedLang(langSuffix);
    // Direct navigation to avoid React hooks issues
    window.location.href = `/v/${videoId}${langSuffix}`;
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/3603e013-56e2-48fb-bac7-640fb28a24e9.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4 fade-in">
            <Globe size={32} className="text-gold" />
          </div>
          <h1 className="text-2xl font-playfair text-gold mb-2 fade-in">Choose Your Language</h1>
          <p className="text-gray-300 fade-in">Select your preferred language to continue</p>
          {videoConfig && <p className="text-gold mt-2 fade-in">{videoConfig.title}</p>}
        </div>

        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.suffix)}
              disabled={selectedLang !== null}
              className={`w-full py-4 px-6 ${
                selectedLang === lang.suffix
                  ? "bg-gold/30"
                  : "bg-black/50 hover:bg-black/70"
              } text-white rounded-lg transition-all flex items-center justify-center gap-3 ${
                selectedLang !== null && selectedLang !== lang.suffix ? "opacity-50" : ""
              } fade-in`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;

