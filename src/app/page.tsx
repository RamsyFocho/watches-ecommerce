import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import TrendingProducts from "@/components/home/TrendingProducts";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <TrendingProducts />
      
      <section id="products" className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
            Our Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
