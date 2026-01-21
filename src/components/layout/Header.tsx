
"use client";

import Link from "next/link";
import { Gem, Heart, Menu, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import CartSheet from "../cart/CartSheet";
import WishlistSheet from "../wishlist/WishlistSheet";
import ProductSearch from "../shared/ProductSearch";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "../ui/separator";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/contact", label: "Contact Us" },
  { href: "/admin/seo-optimizer", label: "SEO Tool"},
];

export default function Header() {
  const { cart, wishlist } = useAppContext();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6 pl-4">
            <Link href="/" className="flex items-center gap-2">
              <Gem className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg hidden sm:inline-block">
                CelestialGems
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ProductSearch />
            <ThemeToggle />
            <Button className="relative" variant="ghost" size="icon" onClick={() => setWishlistOpen(true)}>
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <Badge key={`wishlist-${wishlist.length}`} variant="destructive" className="absolute -top-1 right-2 h-4 w-4 justify-center p-0 text-xs">
                  {wishlist.length}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button className="relative" variant="ghost" size="icon" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <Badge key={`cart-${totalCartItems}`} variant="destructive" className="absolute -top-1 -right-2 h-4 w-4 justify-center p-0 text-xs">
                  {totalCartItems}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>


            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 pt-8">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setMobileMenuOpen(false)}>
                  <Gem className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline text-lg">
                    CelestialGems
                  </span>
                </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setCartOpen} />
      <WishlistSheet open={isWishlistOpen} onOpenChange={setWishlistOpen} />
    </>
  );
}
