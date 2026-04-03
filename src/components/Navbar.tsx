'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  Menu,
  Home,
  ShoppingBag,
  ImageIcon,
  Star,
  Mail,
  Shield,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useNavigationStore } from '@/store/navigation';
import { useAuthStore } from '@/store/auth';
import type { PageName } from '@/types';

const navItems: { label: string; page: PageName; icon: React.ReactNode }[] = [
  { label: 'Home', page: 'home', icon: <Home className="w-4 h-4" /> },
  { label: 'Products', page: 'products', icon: <ShoppingBag className="w-4 h-4" /> },
  { label: 'Gallery', page: 'gallery', icon: <ImageIcon className="w-4 h-4" /> },
  { label: 'Reviews', page: 'reviews', icon: <Star className="w-4 h-4" /> },
  { label: 'Contact', page: 'contact', icon: <Mail className="w-4 h-4" /> },
];

export default function Navbar() {
  const { currentPage, setCurrentPage } = useNavigationStore();
  const { isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageName) => {
    setCurrentPage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdmin = () => {
    if (isAuthenticated) {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('admin-login');
    }
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 glass"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Package className="w-7 h-7 text-primary" />
            </motion.div>
            <span className="text-xl font-bold">
              <span className="text-primary">Box</span>
              <span className="text-foreground">Craft</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className="relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent/50"
              >
                <span
                  className={
                    currentPage === item.page
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                >
                  {item.label}
                </span>
                {currentPage === item.page && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Admin */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdmin}
                  className={
                    currentPage === 'admin-dashboard'
                      ? 'text-primary bg-accent/50'
                      : 'text-muted-foreground'
                  }
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdmin}
                className="text-muted-foreground"
              >
                <Shield className="w-4 h-4 mr-1.5" />
                Admin
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Package className="w-6 h-6 text-primary" />
                      <span className="text-lg font-bold">
                        <span className="text-primary">Box</span>Craft
                      </span>
                    </div>
                  </div>

                  {/* Mobile Nav Links */}
                  <div className="flex-1 py-4">
                    {navItems.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => handleNav(item.page)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          currentPage === item.page
                            ? 'text-primary bg-accent/50 border-r-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}

                    <div className="border-t my-2" />

                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={handleAdmin}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                            currentPage === 'admin-dashboard'
                              ? 'text-primary bg-accent/50 border-r-2 border-primary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAdmin}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
