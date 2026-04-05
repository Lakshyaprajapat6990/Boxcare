'use client';

import { Package, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/store/navigation';

export default function Footer() {
  const { setCurrentPage } = useNavigationStore();

  const handleNav = (page: 'home' | 'products' | 'gallery' | 'reviews' | 'contact') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">
                <span className="text-primary">SHREE</span>SHIDDI VINAYAK PACKING
              </span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Manufacturing excellence since 2010. We provide premium cardboard
              boxes in all sizes with custom solutions for every packaging need.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'Products', page: 'products' as const },
                { label: 'Gallery', page: 'gallery' as const },
                { label: 'Reviews', page: 'reviews' as const },
                { label: 'Contact', page: 'contact' as const },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className="text-sm text-background/70 hover:text-primary transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-background/70">
                  Sector 3, Near vinayak Toll Tax 
                  <br />
                  Saver Road Indore,
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+919977022085" className="text-sm text-background/70 hover:underline">
  +91 9977022085
</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-background/70">sanjay.panchal3006@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/50">
            © {new Date().getFullYear()} SHREE SHIDDI VINAYAK. All rights reserved.
          </p>
          <p className="text-xs text-background/50">
            Premium Cardboard Box Manufacturing
          </p>
        </div>
      </div>
    </footer>
  );
}
