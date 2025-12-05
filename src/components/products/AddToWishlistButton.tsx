"use client";

import { useAppContext } from "@/context/AppContext";
import type { Product } from "@/lib/types";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToWishlistButtonProps extends ButtonProps {
  product: Product;
}

export default function AddToWishlistButton({ product, ...props }: AddToWishlistButtonProps) {
  const { addToWishlist, isInWishlist } = useAppContext();
  const inWishlist = isInWishlist(product.id);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => addToWishlist(product)}
      aria-label="Add to wishlist"
      className={cn(
        "text-muted-foreground hover:text-destructive",
        inWishlist && "text-destructive"
      )}
      {...props}
    >
      <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
    </Button>
  );
}
