
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 24, className = "" }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`animate-spin text-gold ${className}`} size={size} />
      <p className="text-gold mt-2">Loading video...</p>
    </div>
  );
};

export default LoadingSpinner;
