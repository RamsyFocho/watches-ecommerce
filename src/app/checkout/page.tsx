'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { CreditCard, Banknote, Gift, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { handlePlaceOrder } from '../actions/send-order-email';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

// Note: Metadata export is for static analysis and won't be rendered in a client component.
// It's good practice to have a page-level metadata object for reference or potential static generation.
export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your purchase securely at CelestialGems. Enter your shipping and payment details to finalize your order.',
  robots: {
    index: false,
    follow: false,
  }
};


type PaymentDetails = {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  paypalEmail?: string;
  zelleEmail?: string;
  zellePhone?: string;
  venmoHandle?: string;
  appleGiftCardCode?: string;
  appleGiftCardPin?: string;
};

export default function CheckoutPage() {
  const { cart, removeFromCart } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 25;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const customerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
    };

    const paymentDetailsData: PaymentDetails = {
      cardNumber: formData.get('cardNumber')?.toString(),
      expiryDate: formData.get('expiryDate')?.toString(),
      cvc: formData.get('cvc')?.toString(),
      paypalEmail: formData.get('paypalEmail')?.toString(),
      zelleEmail: formData.get('zelleEmail')?.toString(),
      venmoHandle: formData.get('venmoHandle')?.toString(),
      appleGiftCardCode: formData.get('appleGiftCardCode')?.toString(),
      appleGiftCardPin: formData.get('appleGiftCardPin')?.toString(),
    };

    const orderPayload = {
      customer: customerData,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
        imageUrl: item.image,
      })),
      summary: {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        taxes: taxes.toFixed(2),
        total: total.toFixed(2),
      },
      payment: {
        method: paymentMethod,
        details: paymentDetailsData,
      },
    };

    try {
      await handlePlaceOrder(orderPayload);
      toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. A confirmation email has been sent.",
      });
      // Clear cart after successful order
      cart.forEach(item => removeFromCart(item.id, true)); // pass true to suppress toast
      router.push('/');
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not place your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 mb-24 lg:mb-0">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Checkout</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Complete your purchase by providing the details below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="John Doe" 
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="john.doe@example.com" 
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input 
                    id="address" 
                    name="address"
                    placeholder="123 Luxury Lane" 
                    required
                    autoComplete="shipping street-address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city"
                      placeholder="Jewel City" 
                      required
                      autoComplete="shipping address-level2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      name="state"
                      placeholder="CA" 
                      required
                      autoComplete="shipping address-level1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input 
                      id="zip" 
                      name="zip"
                      placeholder="90210" 
                      required
                      autoComplete="shipping postal-code"
                    />
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
                  name="paymentMethod"
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

                  <Label
                    htmlFor="payment-zelle"
                    className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
                  >
                    <RadioGroupItem value="zelle" id="payment-zelle" />
                    <Banknote className="h-5 w-5" />
                    <span className="font-medium">Zelle</span>
                  </Label>

                  <Label
                    htmlFor="payment-apple-giftcard"
                    className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
                  >
                    <RadioGroupItem value="apple-giftcard" id="payment-apple-giftcard" />
                    <Gift className="h-5 w-5" />
                    <span className="font-medium">Apple Gift Card</span>
                  </Label>

                  <Label
                    htmlFor="payment-venmo"
                    className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
                  >
                    <RadioGroupItem value="venmo" id="payment-venmo" />
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">Venmo</span>
                  </Label>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        name="cardNumber" 
                        placeholder="1111 2222 3333 4444" 
                        required
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="expiry-date">Expiration Date</Label>
                        <Input 
                          id="expiryDate"
                          name="expiryDate" 
                          placeholder="MM / YY" 
                          required
                          autoComplete="cc-exp"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc" 
                          name="cvc"
                          placeholder="123" 
                          required
                          autoComplete="cc-csc"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="paypal-email">PayPal Email</Label>
                      <Input 
                        id="paypalEmail" 
                        name="paypalEmail"
                        type="email" 
                        placeholder="paypal@example.com" 
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'zelle' && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="zelle-email">Zelle Email or Phone Number</Label>
                      <Input 
                        id="zelleEmail"
                        name="zelleEmail" 
                        placeholder="email@example.com or (555) 123-4567" 
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple-giftcard' && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="apple-giftcard-code">Apple Gift Card Code</Label>
                      <Input 
                        id="appleGiftCardCode"
                        name="appleGiftCardCode" 
                        placeholder="XXXX-XXXX-XXXX-XXXX" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apple-giftcard-pin">PIN (if applicable)</Label>
                      <Input 
                        id="appleGiftCardPin"
                        name="appleGiftCardPin"
                        placeholder="1234" 
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'venmo' && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="venmo-handle">Venmo Username</Label>
                      <Input 
                        id="venmoHandle"
                        name="venmoHandle"
                        placeholder="@username" 
                        required
                      />
                    </div>
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
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
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

            <div className="hidden lg:block mt-6">
                <Button 
                    size="lg" 
                    className="w-full" 
                    type="submit"
                    disabled={cart.length === 0 || isSubmitting}
                >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground text-center">
              <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>

        {/* Sticky Footer for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex flex-col gap-2">
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <Button 
                size="lg" 
                className="w-full" 
                type="submit"
                disabled={cart.length === 0 || isSubmitting}
            >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
        </div>
      </form>
    </div>
  );
}
