"use client";

import { useAppContext } from "@/context/AppContext";
import type { Product } from "@/lib/types";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
}

export default function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const { addToCart, isInCart } = useAppContext();
  const inCart = isInCart(product.id);

  return (
    <Button onClick={() => addToCart(product)} disabled={inCart} {...props}>
      {inCart ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
