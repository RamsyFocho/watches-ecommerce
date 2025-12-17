import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with CelestialGems for inquiries, support, and feedback. We are here to help you with your luxury watch questions.',
  keywords: ['contact celestialgems', 'watch support', 'jewelry inquiry', 'customer service'],
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact Us</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          We're here to help with any questions you may have. Reach out to us and we'll respond as soon as we can.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and our team will get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} />
              </div>
              <Button type="submit" className="w-full" disabled>Submit Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline">Our Information</h2>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <a href="mailto:support@celestialgems.com" className="text-muted-foreground hover:text-primary">support@celestialgems.com</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Phone</h3>
                        <a href="tel:123-456-7890" className="text-muted-foreground hover:text-primary">(123) 456-7890</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Address</h3>
                        <p className="text-muted-foreground">123 Elegance Avenue, Jewel City, 90210</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
