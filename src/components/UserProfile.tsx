"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { CgSpinner } from "react-icons/cg";

interface UserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    if (status === "authenticated" && session?.user) {
      setUserData({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    }
  }, [session, status]);

  // Get initials for the avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Default placeholder image from a reliable source
  const placeholderImage = "https://ui-avatars.com/api/?background=random";

  if (status === "loading") {
    return <CgSpinner className="animate-spin text-lg" />;
  }

  if (status === "unauthenticated" || !userData) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signIn()}
        className="flex items-center gap-2"
      >
        <User size={16} />
        <span>Login</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-max rounded-full pl-1 h-10 pr-4">
          <Avatar className="h-8 w-8 rounded-full ">
            {isClient && (
              <AvatarImage
                src={userData.image || `${placeholderImage}&name=${encodeURIComponent(userData.name || 'User')}`}
                alt={userData.name || "Profile picture"}
              />
            )}
            <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
          </Avatar>
          <p>{userData.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{userData.name}</p>
          <p className="text-xs text-muted-foreground">{userData.email}</p>
        </div>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
