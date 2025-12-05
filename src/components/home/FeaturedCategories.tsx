import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/products";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">
            Explore by Category
            </h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover your next favorite timepiece from our curated collections.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0,3).map((category) => (
            <Link key={category.name} href="/categories" className="group block">
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="relative h-64 w-full">
                  <Image
                    src={category.image.imageUrl}
                    alt={category.description}
                    data-ai-hint={category.image.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </div>
                <CardHeader className="flex-grow flex flex-col justify-center items-center text-center bg-background/80 backdrop-blur-sm">
                  <CardTitle className="text-2xl font-headline text-foreground">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/categories">View All Categories</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
