import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center p-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline mb-4 drop-shadow-lg">
          CelestialGems
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
          Discover Timeless Elegance in Every Piece
        </p>
        <Button asChild size="lg" className="font-bold text-base">
          <Link href="/#products">Explore Collections</Link>
        </Button>
      </div>
    </section>
  );
}
