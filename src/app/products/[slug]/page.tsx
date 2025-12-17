import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import AddToCartButton from "@/components/products/AddToCartButton";
import AddToWishlistButton from "@/components/products/AddToWishlistButton";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | CelestialGems`,
    description: product.description,
    openGraph: {
        images: [product.image.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="aspect-square w-full relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            data-ai-hint={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-primary mb-1">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{product.description}</p>
          </div>

          <Separator />

          <div>
             <h2 className="text-xl font-semibold font-headline mb-2">About this piece</h2>
             <p className="text-foreground/80 leading-relaxed">{product.longDescription}</p>
          </div>

          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <AddToCartButton product={product} size="lg" className="w-full sm:w-auto"/>
            <AddToWishlistButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
