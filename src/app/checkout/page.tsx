'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 25;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Checkout</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Complete your purchase by providing the details below.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact and Payment Info */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input id="address" placeholder="123 Luxury Lane" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Jewel City" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="90210" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you'd like to pay.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <Label
                  htmlFor="payment-card"
                  className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
                >
                  <RadioGroupItem value="card" id="payment-card" />
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Credit Card</span>
                </Label>
                <Label
                  htmlFor="payment-paypal"
                  className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
                >
                  <RadioGroupItem value="paypal" id="payment-paypal" />
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.483.332a.5.5 0 00-.48.492l-1.12 7.747a.5.5 0 00.48.552h3.332a.5.5 0 00.492-.48l.14-1.205a.5.5 0 01.492-.48h2.09a.5.5 0 01.492.48l.07 1.205a.5.5 0 00.492.48h2.24l.552-3.81a.5.5 0 00-.48-.552h-2.1a.5.5 0 00-.492.48l-.08 1.37a.5.5 0 01-.492.48h-2.09a.5.5 0 01-.492-.48l-.13-1.037a.5.5 0 00-.493-.48H8.53a.5.5 0 00-.492.48l-.13 1.037a.5.5 0 01-.492.48H5.215a.5.5 0 00-.492.48L3.6 13.52a.5.5 0 00.492.553h3.58a.5.5 0 00.48-.493l.68-4.71a.5.5 0 01.492-.48h2.09a.5.5 0 01.492.48l-1.02 7.06a.5.5 0 00.492.553h2.64c.25 0 .46-.18.492-.42l1.32-9.15a.5.5 0 00-.492-.553H9.86a.5.5 0 00-.48.492l-.12 1.02a.5.5 0 01-.492.48H6.68a.5.5 0 01-.492-.48L5.5 2.12a.5.5 0 00-.492-.48H2.12a.5.5 0 00-.48.492L.32 11.28a.5.5 0 00.492.553h2.58a.5.5 0 00.492-.48l.42-2.91a.5.5 0 01.492-.48h2.82a.5.5 0 000-1H4.8a.5.5 0 00-.492.48L3.89 10.3a.5.5 0 01-.492.48H.812a.5.5 0 00-.492.48l-1.01 7.06A.5.5 0 00-.21 20h4.24a.5.5 0 00.492-.48l.12-1.02a.5.5 0 01.492-.48h2.09a.5.5 0 01.492.48l-.3 2.06a.5.5 0 00.492.553H11.5c4.08 0 7.23-2.34 8.01-6.23.2-1 .25-2.02.06-3.03C19.12 6.8 16.5 4.3 12.9 4.3H9.28a.5.5 0 00-.48.492L7.68 13.94a.5.5 0 01-.492.48H4.67a.5.5 0 01-.492-.48l.21-1.46a.5.5 0 00-.492-.553H.332a.5.5 0 00-.48.492l-.42 2.91a.5.5 0 01-.492.48H-2.5a.5.5 0 00-.492.48l-1.32 9.15a.5.5 0 00.492.553h14.8c4.4 0 8.02-2.88 8.02-7.23 0-3.32-1.95-6.03-4.73-6.95-1.12-.37-2.3-.55-3.5-.55H7.483z" />
                  </svg>
                  <span className="font-medium">PayPal</span>
                </Label>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="mt-6 space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1111 2222 3333 4444" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="expiry-date">Expiration Date</Label>
                      <Input id="expiry-date" placeholder="MM / YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
               {paymentMethod === 'paypal' && (
                <div className="mt-6 pt-4 border-t">
                   <Button className="w-full" disabled>
                     Continue with PayPal
                   </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="row-start-1 lg:row-start-auto">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                            <Image
                                src={item.image.imageUrl}
                                alt={item.name}
                                data-ai-hint={item.image.imageHint}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                       </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full mt-6" disabled={cart.length === 0}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
