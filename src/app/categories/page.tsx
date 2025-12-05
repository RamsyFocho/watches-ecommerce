import Link from "next/link";
import Image from "next/image";
import { products, categories, brands } from "@/lib/products";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'Product Categories | CelestialGems',
  description: 'Explore our collection of fine jewelry by category and brand.',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Browse Categories & Brands</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect piece from our curated collections.
        </p>
      </div>
      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.name}>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative w-full md:w-1/3 h-64 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={category.image.imageUrl}
                  alt={category.description}
                  data-ai-hint={category.image.imageHint}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/30" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-headline">{category.name} Watches</h2>
                <p className="text-muted-foreground mt-2">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {brands
                .filter((brand) => brand.category === category.name)
                .map((brand) => (
                  <Link key={brand.name} href={`/brands/${brand.slug}`} className="group block">
                    <Card className="overflow-hidden h-full flex flex-col justify-center items-center text-center transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:-translate-y-2">
                       <CardHeader>
                        <CardTitle className="text-2xl font-headline text-foreground">
                          {brand.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline">View Collection</Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
