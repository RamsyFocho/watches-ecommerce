"use client";

import { useState, useTransition } from "react";
import { products } from "@/lib/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { suggestSeoImprovements } from "@/ai/flows/ai-suggested-product-seo";
import type { SuggestSeoImprovementsOutput } from "@/ai/flows/ai-suggested-product-seo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wand2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function SeoOptimizerTool() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestSeoImprovementsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleGenerate = () => {
    if (!selectedProduct) return;

    setError(null);
    setSuggestions(null);

    startTransition(async () => {
      try {
        const result = await suggestSeoImprovements({
          productName: selectedProduct.name,
          currentDescription: selectedProduct.longDescription,
        });
        setSuggestions(result);
      } catch (e) {
        console.error(e);
        setError("Failed to generate SEO suggestions. Please try again.");
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Product SEO Enhancement</CardTitle>
        <CardDescription>
          Select a product to get started. Our AI will analyze it and provide
          SEO improvements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="product-select">Product</Label>
          <Select
            onValueChange={setSelectedProductId}
            defaultValue={selectedProductId ?? undefined}
          >
            <SelectTrigger id="product-select">
              <SelectValue placeholder="Select a product..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Current Description</Label>
              <Textarea
                readOnly
                value={selectedProduct.longDescription}
                rows={5}
                className="bg-muted"
              />
            </div>
          </div>
        )}

        {isPending && (
          <div className="space-y-4 pt-4 border-t">
             <Skeleton className="h-6 w-48 mb-2" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-3/4" />
             <Skeleton className="h-20 w-full mt-4" />
          </div>
        )}

        {suggestions && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">AI Suggestions</h3>
            <div className="space-y-2">
              <Label>Suggested Keywords</Label>
              <Input
                readOnly
                value={suggestions.suggestedKeywords}
                className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Optimized Description</Label>
              <Textarea
                readOnly
                value={suggestions.optimizedDescription}
                rows={5}
                className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              />
            </div>
            <Alert>
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                    These AI-generated suggestions are ready. In a real application, you could click a button to save these updates directly to your product database.
                </AlertDescription>
            </Alert>
          </div>
        )}
        
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerate}
          disabled={!selectedProductId || isPending}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isPending ? "Generating..." : "Generate Suggestions"}
        </Button>
      </CardFooter>
    </Card>
  );
}
