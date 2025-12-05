"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import AddToCartButton from "../products/AddToCartButton";

interface WishlistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WishlistSheet({ open, onOpenChange }: WishlistSheetProps) {
  const { wishlist, removeFromWishlist } = useAppContext();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Wishlist ({wishlist.length})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-6">
              {wishlist.length === 0 ? (
                <p className="text-center text-muted-foreground">Your wishlist is empty.</p>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image
                        src={item.image.imageUrl}
                        alt={item.name}
                        data-ai-hint={item.image.imageHint}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <AddToCartButton product={item} size="sm" className="mt-2" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromWishlist(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
