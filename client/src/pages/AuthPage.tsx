import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AuthPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
           <motion.div 
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="w-20 h-20 bg-gradient-to-tr from-primary to-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-primary/20"
           >
             <span className="text-4xl font-display font-bold text-white">C</span>
           </motion.div>
           <h1 className="text-3xl font-display font-bold tracking-tight mb-2">CleanCity Connect</h1>
           <p className="text-muted-foreground">Join your neighbors in building a better city.</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={handleLogin}
                size="lg" 
                className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl transition-transform active:scale-[0.98]"
              >
                Log In / Sign Up
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Features</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Report Issues
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Track Status
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> AI Assistant
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Earn Badges
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
