import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Home, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { VIDEOS_CONFIG } from "@/config/videos";
import LanguageSelector from "@/components/LanguageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import LoadingSpinner from "@/components/LoadingSpinner";

const VideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const baseVideoId = videoId?.split('-')[0];
  const langSuffix = videoId?.includes('-') ? videoId?.substring(videoId.indexOf('-')) : null;
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!langSuffix && baseVideoId) {
    return <LanguageSelector videoId={baseVideoId} />;
  }

  const baseVideo = baseVideoId ? VIDEOS_CONFIG[baseVideoId as keyof typeof VIDEOS_CONFIG] : null;
  
  const getYoutubeId = () => {
    if (!baseVideo) return null;
    
    if (langSuffix && baseVideo.languages) {
      const lang = langSuffix.substring(1);
      if (lang === 'en' && baseVideo.languages.en) {
        return baseVideo.languages.en;
      } else if (lang === 'fr' && baseVideo.languages.fr) {
        return baseVideo.languages.fr;
      } else if (lang === 'ar' && baseVideo.languages.ar) {
        return baseVideo.languages.ar;
      }
    }
    return baseVideo.youtubeId;
  };
  
  const youtubeId = getYoutubeId();
  
  useEffect(() => {
    if (!baseVideo) {
      setError("Video not found.");
      return;
    }
    
    if (!youtubeId) {
      setError("Video for this language not found.");
      return;
    }
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.event === "onStateChange") {
          if (data.info === 1) {
            setIsPlaying(true);
            setIsLoaded(true);
          } else if (data.info === 2) {
            setIsPlaying(false);
          }
        }

        if (data.event === "onReady") {
          setIsLoaded(true);
        }
      } catch (e) {
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    const loadTimeout = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimeout);
      window.removeEventListener('message', handleMessage);
    };
  }, [youtubeId, baseVideo]);
  
  const handleControlsToggle = () => {
    setShowControls(true);
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    try {
      const iframe = videoRef.current;
      if (iframe && iframe.contentWindow) {
        const func = isPlaying ? 'pauseVideo' : 'playVideo';
        iframe.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, '*');
      }
    } catch (e) {
      console.error("Could not control video playback", e);
    }
  };
  
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    
    try {
      const iframe = videoRef.current;
      if (iframe && iframe.contentWindow) {
        const func = isMuted ? 'unMute' : 'mute';
        iframe.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, '*');
      }
    } catch (e) {
      console.error("Could not control video audio", e);
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center text-center p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => navigate("/")} className="text-gold underline hover:text-gold/80">Return to Home</button>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen bg-darkBg flex flex-col" 
      onClick={handleControlsToggle}
      style={{ 
        backgroundImage: 'url("/museum-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>
        
        {baseVideo && (
          <>
            <div className="text-white text-sm font-medium mb-2 text-center w-full">
              <a 
                href="https://israa-media.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gold transition-colors"
              >
                by israa-media.com
              </a>
            </div>
            
            {baseVideo.title && <h1 className="text-gold text-2xl font-playfair mb-4 fade-in">{baseVideo.title}</h1>}
            
            <div 
              ref={containerRef}
              className={`video-container relative w-full max-w-4xl bg-black overflow-hidden ${isLoaded ? "loaded" : ""}`}
              style={{ 
                maxHeight: '80vh',
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {!isLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                  <LoadingSpinner size={48} />
                </div>
              )}
              
              <div className="absolute inset-0 z-20 pointer-events-auto"></div>
              
              <div className="absolute inset-0 z-10 pointer-events-none bg-black/5"></div>
              
              <AspectRatio ratio={9/16} className="w-full h-full">
                <iframe
                  ref={videoRef}
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&showinfo=0&origin=${window.location.origin}&iv_load_policy=3&fs=0&disablekb=1&playlist=${youtubeId}&loop=1&autoplay=1&playsinline=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={baseVideo.title || `Exhibit: ${baseVideoId}`}
                  style={{ position: 'relative', zIndex: 1 }}
                />
              </AspectRatio>
              
              <div className={`player-controls absolute bottom-0 left-0 right-0 bg-black/50 p-3 flex justify-between items-center transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={() => navigate("/")} className="control-btn p-2 text-white hover:text-gold">
                  <Home size={24} />
                </button>
                
                <div className="flex gap-4">
                  <button onClick={handlePlayPause} className="control-btn p-2 text-white hover:text-gold">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <button onClick={handleMuteToggle} className="control-btn p-2 text-white hover:text-gold">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>
              </div>
            </div>
            {baseVideo.description && (
              <p className="text-white text-center mt-4 max-w-md bg-black/30 p-3 rounded-lg fade-in">
                {baseVideo.description}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
