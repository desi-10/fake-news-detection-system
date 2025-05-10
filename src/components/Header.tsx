import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import UserProfile from "./UserProfile";

const NAV_ITEMS = [
  { label: "Home", href: "/", muted: false },
  { label: "About", href: "/about", muted: true },
  { label: "Feedback", href: "/feedback", muted: true },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">Fake News Detector</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          {NAV_ITEMS.map(({ label, href, muted }) => (
            <Link
              key={label}
              href={href}
              className={`text-sm font-medium ${
                muted ? "text-muted-foreground" : ""
              }`}
            >
              {label}
            </Link>
          ))}
          <UserProfile />
        </nav>
      </div>
    </header>
  );
};

export default Header;
