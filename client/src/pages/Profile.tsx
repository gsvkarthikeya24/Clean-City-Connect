import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, ShieldCheck, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-display font-bold mb-6">My Profile</h1>
      
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-xl">
          <AvatarImage src={user.profileImageUrl || ""} />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {user.firstName?.[0] || user.email?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
        <p className="text-muted-foreground text-sm">{user.email}</p>
        <div className="mt-2 flex items-center gap-2">
           <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
             Verified Citizen
           </span>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account</h3>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Personal Information</p>
                <p className="text-xs text-muted-foreground">Edit your details</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Privacy & Security</p>
                <p className="text-xs text-muted-foreground">Manage your data</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">App Settings</p>
                <p className="text-xs text-muted-foreground">Notifications, Theme</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Support</h3>
          </CardHeader>
          <CardContent className="space-y-1">
            <Link href="/assistant">
              <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Contact Support</p>
                  <p className="text-xs text-muted-foreground">Get help with the app</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Button 
          variant="destructive" 
          className="w-full h-12 rounded-xl mt-6 font-medium" 
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}
