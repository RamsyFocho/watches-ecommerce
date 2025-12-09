"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";


interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, removeFromCart, updateCartQuantity } = useAppContext();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-6 p-6 pr-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground">Your cart is empty.</p>
                  <Button variant="outline" className="mt-4" onClick={() => onOpenChange(false)}>Continue Shopping</Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <Image
                        src={item.image.imageUrl}
                        alt={item.name}
                        data-ai-hint={item.image.imageHint}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Select
                          value={String(item.quantity)}
                          onValueChange={(value) => updateCartQuantity(item.id, parseInt(value, 10))}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder="Qty" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(10).keys()].map(i => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                       <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        {cart.length > 0 && (
            <SheetFooter className="p-6 pt-4 mt-auto border-t space-y-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full" size="lg" onClick={() => onOpenChange(false)}>
                 <Link href="/checkout">Checkout</Link>
              </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
