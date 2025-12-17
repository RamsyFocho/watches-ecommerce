import { notFound } from "next/navigation";
import { products, brands } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) {
    return {
      title: "Brand Not Found",
      description: "The watch brand you are looking for could not be found.",
    };
  }

  return {
    title: `Shop ${brand.name} Watches`,
    description: `Explore our exclusive collection of ${brand.name} watches. Find timeless elegance and cutting-edge design from ${brand.name} at CelestialGems.`,
    keywords: [brand.name, `${brand.name} watches`, 'luxury watches', 'buy watches', brand.category],
  };
}

export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = brands.find((b) => b.slug === params.slug);

  if (!brand) {
    notFound();
  }

  const brandProducts = products.filter((p) => p.brand === brand.name);
  const professionalModels = brandProducts.filter(p => p.modelType === 'Professional');
  const classicModels = brandProducts.filter(p => p.modelType === 'Classic');
  const otherModels = brandProducts.filter(p => !p.modelType);

  const hasModelTypes = professionalModels.length > 0 || classicModels.length > 0;

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">{brand.name}</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Discover our curated collection of {brand.name} timepieces.
        </p>
      </div>
      
      {hasModelTypes ? (
        <div className="space-y-16">
          {professionalModels.length > 0 && (
            <section>
              <h2 className="text-3xl font-headline mb-8 text-center">💎 Professional Models</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {professionalModels.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {classicModels.length > 0 && (
            <section>
              <h2 className="text-3xl font-headline mb-8 text-center">💎 Classic Models</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {classicModels.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

           {otherModels.length > 0 && (
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {otherModels.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

        </div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {brandProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}

    </div>
  );
}
