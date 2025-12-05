import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block group">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              data-ai-hint={product.image.imageHint}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold font-headline leading-tight">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
        <AddToCartButton product={product} size="sm" className="flex-grow" />
        <Button asChild variant="outline" size="sm">
          <Link href={`/products/${product.slug}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </Button>
        <AddToWishlistButton product={product} />
      </CardFooter>
    </Card>
  );
}
