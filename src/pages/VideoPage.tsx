
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Home, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { VIDEOS_CONFIG } from "@/config/videos";
import LanguageSelector from "@/components/LanguageSelector";
import LoadingSpinner from "@/components/LoadingSpinner";

const VideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  // Check if the URL includes a language suffix
  const baseVideoId = videoId?.split('-')[0];
  const langSuffix = videoId?.includes('-') ? videoId?.substring(videoId.indexOf('-')) : null;
  
  // State for video player
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // If no language is selected yet, show the language selector
  if (!langSuffix && baseVideoId) {
    return <LanguageSelector videoId={baseVideoId} />;
  }

  // Get the appropriate video configuration
  const baseVideo = baseVideoId ? VIDEOS_CONFIG[baseVideoId as keyof typeof VIDEOS_CONFIG] : null;
  
  // Determine which YouTube ID to use based on language
  const getYoutubeId = () => {
    if (!baseVideo) return null;
    
    // If we have a language suffix and the video has language options
    if (langSuffix && baseVideo.languages) {
      const lang = langSuffix.substring(1); // Remove the '-' character
      if (lang === 'en' && baseVideo.languages.en) {
        return baseVideo.languages.en;
      } else if (lang === 'fr' && baseVideo.languages.fr) {
        return baseVideo.languages.fr;
      } else if (lang === 'ar' && baseVideo.languages.ar) {
        return baseVideo.languages.ar;
      }
    }
    
    // Default to the main youtubeId if no language match or no language options
    return baseVideo.youtubeId;
  };
  
  const youtubeId = getYoutubeId();
  
  useEffect(() => {
    // Reset state when component mounts
    setIsLoading(true);
    setError("");
    
    if (!baseVideo) {
      setError("Video not found.");
      setIsLoading(false);
      return;
    }
    
    if (!youtubeId) {
      setError("Video for this language not found.");
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    // Add message listener for YouTube API events
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.event === "onStateChange") {
          if (data.info === 1) { // playing
            setIsPlaying(true);
            setIsLoading(false);
          } else if (data.info === 2) { // paused
            setIsPlaying(false);
          }
        } else if (data.event === "onReady") {
          // Try to play the video when it's ready
          if (videoRef.current && videoRef.current.contentWindow) {
            videoRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          }
          setIsLoading(false);
        }
      } catch (e) {
        // Not a parseable message, ignore
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      clearTimeout(timer);
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
    <div className="min-h-screen bg-darkBg flex flex-col" onClick={handleControlsToggle}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {baseVideo && (
          <>
            <h1 className="text-gold text-2xl font-playfair mb-4">{baseVideo.title}</h1>
            <div 
              ref={containerRef}
              className="video-container relative w-full max-w-4xl bg-black overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                  <LoadingSpinner size={48} />
                </div>
              )}
              
              <div className="absolute inset-0 z-10 pointer-events-none bg-black/5"></div>
              
              <iframe
                ref={videoRef}
                className={`w-full aspect-video ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&showinfo=0&origin=${window.location.origin}&iv_load_policy=3&fs=0&disablekb=1&playlist=${youtubeId}&loop=1&autoplay=1&mute=1&playsinline=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={baseVideo.title}
                style={{ position: 'relative', zIndex: 1 }}
              />
              
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
            <p className="text-white text-center mt-4 max-w-md">{baseVideo.description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
