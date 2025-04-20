
import { Globe } from "lucide-react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { VIDEOS_CONFIG } from "@/config/videos";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LanguageSelectorProps {
  videoId: string;
}

const languages = [
  { code: "en", name: "English", suffix: "-en" },
  { code: "fr", name: "Français", suffix: "-fr" },
  { code: "ar", name: "العربية", suffix: "-ar" },
];

const LanguageSelector = ({ videoId }: LanguageSelectorProps) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [navigateTo, setNavigateTo] = useState<string | null>(null);

  const videoConfig = VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG];
  
  useEffect(() => {
    // Reset navigation state when component mounts or videoId changes
    setIsNavigating(false);
    setSelectedLang(null);
    setNavigateTo(null);
  }, [videoId]);

  const handleLanguageSelect = (langSuffix: string) => {
    setIsNavigating(true);
    setSelectedLang(langSuffix);
    
    // Instead of navigating directly, set the target URL in state
    setNavigateTo(`/v/${videoId}${langSuffix}`);
  };

  // If navigateTo is set, render a Navigate component to perform a full navigation
  if (navigateTo) {
    return <Navigate to={navigateTo} replace />;
  }

  return (
    <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <Globe size={32} className="text-gold" />
          </div>
          <h1 className="text-2xl font-playfair text-gold mb-2">Choose Your Language</h1>
          <p className="text-gray-400">Select your preferred language to continue</p>
          {videoConfig && <p className="text-gold mt-2">{videoConfig.title}</p>}
        </div>

        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.suffix)}
              disabled={isNavigating}
              className={`w-full py-4 px-6 ${
                isNavigating && selectedLang === lang.suffix
                  ? "bg-gold/30"
                  : "bg-black/30 hover:bg-black/40"
              } text-white rounded-lg transition-all flex items-center justify-center gap-3 ${
                isNavigating && selectedLang !== lang.suffix ? "opacity-50" : ""
              }`}
            >
              {isNavigating && selectedLang === lang.suffix ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Loading</span> {lang.name}...
                </span>
              ) : (
                lang.name
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
