
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VIDEOS_CONFIG } from "@/config/videos";

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
  const videoConfig = VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG];

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
              onClick={() => navigate(`/v/${videoId}${lang.suffix}`)}
              className="w-full py-4 px-6 bg-black/30 hover:bg-black/40 text-white rounded-lg transition-all flex items-center justify-center gap-3"
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
