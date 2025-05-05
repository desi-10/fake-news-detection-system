import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">Fake News Detector</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
