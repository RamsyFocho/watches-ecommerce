import Link from "next/link";
import { Gem, Twitter, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Gem className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">
              CelestialGems
            </span>
          </div>
          <div className="flex gap-4 mb-6 md:mb-0">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {year} CelestialGems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
