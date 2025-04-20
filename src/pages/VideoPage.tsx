import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Home, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { VIDEOS_CONFIG } from "@/config/videos";

// Token validation function
const validateToken = (token: string | null, videoId: string | undefined): boolean => {
  if (!token || !videoId) return false;
  
  // Simple validation - token must start with "eyJ" (like a JWT)
  // and contain the videoId encoded in base64
  if (!token.startsWith("eyJ")) return false;
  
  try {
    // Extract the middle part of the token which would be the payload in a JWT
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if the video ID matches and token is not expired
    return (
      payload.vid === videoId && 
      payload.exp > Date.now()
    );
  } catch (e) {
    console.error("Token validation error:", e);
    return false;
  }
};

const VideoPage = () => {
  const { videoId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Validate the token and videoId
    if (!validateToken(token, videoId)) {
      setError("Invalid or expired access link. Please scan a valid QR code.");
      toast({
        variant: "destructive",
        title: "Access Error",
        description: "Invalid or expired access link."
      });
      return;
    }
    
    const videoConfig = videoId ? VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG] : null;
    if (!videoConfig) {
      setError("Video not found.");
      return;
    }
    
    setIsLoading(false);
    
    // Hide controls after 3 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [videoId, token]);
  
  const handleControlsToggle = () => {
    setShowControls(true);
    // Hide controls again after 3 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Control the YouTube video using the iframe API
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
    
    // Control the YouTube video using the iframe API
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
  
  const videoConfig = videoId ? VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG] : null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center text-center p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <Link to="/" className="text-gold underline hover:text-gold/80">Return to Home</Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-darkBg flex flex-col" onClick={handleControlsToggle}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {videoConfig && (
          <>
            <h1 className="text-gold text-2xl font-playfair mb-4">{videoConfig.title}</h1>
            <div className={`video-container relative w-full ${isMobile ? 'max-w-full' : 'max-w-4xl'} bg-black`}>
              <iframe
                ref={videoRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoConfig.youtubeId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&showinfo=0&origin=${window.location.origin}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoConfig.title}
                onLoad={() => setIsPlaying(true)}
              ></iframe>
              
              <div className={`player-controls absolute bottom-0 left-0 right-0 bg-black/50 p-3 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
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
            <p className="text-white text-center mt-4 max-w-md">{videoConfig.description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
