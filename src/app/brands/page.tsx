import Link from "next/link";
import { brands } from "@/lib/products";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'All Watch Brands',
  description: 'Explore our complete collection of fine watches from the world\'s leading brands, including Rolex, Omega, Patek Philippe, and more.',
  keywords: ['watch brands', 'luxury watch brands', 'designer watch brands', 'all brands'],
};

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Explore Our Brands</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Discover timeless elegance and cutting-edge design from our curated selection of watchmakers.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {brands.map((brand) => (
          <Link key={brand.slug} href={`/brands/${brand.slug}`} className="group block" title={`View collection of ${brand.name} watches`}>
            <Card className="h-full flex flex-col justify-center items-center text-center transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:-translate-y-2">
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
    </div>
  );
}
