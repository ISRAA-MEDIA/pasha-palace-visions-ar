
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Home, Play, Pause } from "lucide-react";

// This would be replaced with a real database or config file
const VIDEOS_CONFIG = {
  'sample': {
    youtubeId: 'dQw4w9WgXcQ', // Just a placeholder, replace with your actual video
    title: 'The Grand Hall',
    description: 'Discover the ornate details of the main reception hall',
  },
  'dining': {
    youtubeId: 'wuQEFQ7oZzk', // Another placeholder
    title: 'The Dining Chamber',
    description: 'Where elegant feasts were once served to distinguished guests',
  }
};

const VideoPage = () => {
  const { videoId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (!videoId || !token) {
      setError("Invalid video link. Please scan a valid QR code.");
      return;
    }
    
    // Simple validation - in reality you'd verify the token on your server
    if (!token.startsWith("eyJ")) {
      setError("Unauthorized access.");
      return;
    }
    
    const videoConfig = VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG];
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
    
    // In a real implementation, you'd use the YouTube Player API to control the video
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
            <div className="video-container">
              <iframe
                ref={videoRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoConfig.youtubeId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&showinfo=0&origin=${window.location.origin}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoConfig.title}
                onLoad={() => setIsPlaying(true)}
              ></iframe>
              
              <div className={`player-controls ${showControls ? 'visible' : ''}`}>
                <button onClick={() => navigate("/")} className="control-btn">
                  <Home size={24} />
                </button>
                <button onClick={handlePlayPause} className="control-btn">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
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
