
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Home, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { VIDEOS_CONFIG } from "@/config/videos";

const VideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    const videoConfig = videoId ? VIDEOS_CONFIG[videoId as keyof typeof VIDEOS_CONFIG] : null;
    if (!videoConfig) {
      setError("Video not found.");
      return;
    }
    
    setIsLoading(false);
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange") {
          setIsPlaying(data.info === 1);
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
  }, [videoId]);
  
  const handleControlsToggle = () => {
    setShowControls(true);
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  const handlePlayPause = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    
    try {
      const iframe = videoRef.current;
      if (iframe && iframe.contentWindow) {
        const func = newState ? 'playVideo' : 'pauseVideo';
        iframe.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, '*');
      }
    } catch (e) {
      console.error("Could not control video playback", e);
    }
  };
  
  const handleMuteToggle = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    
    try {
      const iframe = videoRef.current;
      if (iframe && iframe.contentWindow) {
        const func = newState ? 'mute' : 'unMute';
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
        <button onClick={() => navigate("/")} className="text-gold underline hover:text-gold/80">
          Return to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-darkBg flex flex-col" onClick={handleControlsToggle}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {videoConfig && (
          <>
            <h1 className="text-gold text-2xl font-playfair mb-4">{videoConfig.title}</h1>
            <div className="video-container relative w-full max-w-4xl">
              <iframe
                ref={videoRef}
                src={`https://www.youtube-nocookie.com/embed/${videoConfig.youtubeId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&showinfo=0&origin=${window.location.origin}&iv_load_policy=3&fs=0&disablekb=1&playlist=${videoConfig.youtubeId}&loop=1&autoplay=0&color=white&cc_load_policy=0`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoConfig.title}
              ></iframe>
              
              <div className={`player-controls ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={() => navigate("/")} className="control-btn">
                  <Home size={24} />
                </button>
                
                <div className="flex gap-4">
                  <button onClick={handlePlayPause} className="control-btn">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <button onClick={handleMuteToggle} className="control-btn">
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
