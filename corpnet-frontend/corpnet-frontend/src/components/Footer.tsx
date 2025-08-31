// src/components/Footer.tsx
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary/10 via-background to-primary/10 border-t border-border mt-12">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ==== Column 1: Brand Info ==== */}
        <div>
          <h2 className="text-xl font-bold text-primary">CropNet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Providing Fruits and Vegetables directly from Farmers to Customers with transparency and trust.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} CropNet. All rights reserved.
          </p>
        </div>

        {/* ==== Column 2: Contact ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Contact</h3>
          <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 text-primary" /> 123 Mansoorah Bazaar, Lahore, Pakistan
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Phone className="h-4 w-4 text-primary" /> +900000000
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" /> support@corpnet.com
          </p>
        </div>

        {/* ==== Column 3: Quick Links ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="/products" className="hover:text-primary transition-colors">Products</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* ==== Column 4: Socials ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="mailto:support@corpnet.com"
              className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

    

      {/* =============== OLD CODE FOR REFERENCE ===============
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} CorpNet. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="https://facebook.com" ...><Facebook /></a>
            <a href="https://twitter.com" ...><Twitter /></a>
            <a href="https://instagram.com" ...><Instagram /></a>
            <a href="mailto:support@corpnet.com"><Mail /></a>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-xs text-muted-foreground text-center">
          Built with ❤️ using React, TailwindCSS, and shadcn/ui
        </div>
      </div>
      ======================================================== */}
    </footer>
  );
};

export default Footer;
