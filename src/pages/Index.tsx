
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gold mb-6">
          Museum Guide Experience
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl">
          Discover our exhibits through interactive videos
        </p>
        <div className="space-y-4">
          <Link to="/scan">
            <Button size="lg" className="w-64 bg-gold text-black hover:bg-gold/80">
              Scan QR Code
            </Button>
          </Link>
          
          {!user && (
            <div className="mt-8">
              <Link to="/auth" className="text-sm text-gray-400 hover:text-gold">
                Admin Login
              </Link>
            </div>
          )}
          
          {user && (
            <div className="mt-4">
              <Link to="/admin">
                <Button variant="outline" size="lg" className="w-64">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
