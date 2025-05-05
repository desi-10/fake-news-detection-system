import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 Fake News Detector. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
