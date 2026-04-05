'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation';
import { useAuthStore } from '@/store/auth';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import StatsSection from '@/components/sections/StatsSection';
import ProductGallery from '@/components/sections/ProductGallery';
import GallerySection from '@/components/sections/GallerySection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactSection from '@/components/sections/ContactSection';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

function HomePage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <StatsSection />
      <ProductGallery />
      <ReviewsSection />
      <ContactSection />
    </motion.div>
  );
}

function ProductsPage() {
  return (
    <div className="pt-16">
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ProductGallery />
        <ContactSection />
      </motion.div>
    </div>
  );
}

function GalleryPage() {
  return (
    <div className="pt-16">
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <GallerySection />
      </motion.div>
    </div>
  );
}

function ReviewsPage() {
  return (
    <div className="pt-16">
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ReviewsSection />
      </motion.div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pt-16">
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ContactSection />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const seeded = useRef(false);
  const { currentPage } = useNavigationStore();
  const { isAuthenticated, admin, token } = useAuthStore();

  // Restore auth from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('SHREE SHIDDI VINAYAK_token');
      const savedAdmin = localStorage.getItem('SHREE SHIDDI VINAYAK_admin');
      if (savedToken && savedAdmin) {
        const { login } = useAuthStore.getState();
        try {
          login(JSON.parse(savedAdmin), savedToken);
          // Verify token
          fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: savedToken }),
          }).then((res) => {
            if (!res.ok) {
              useAuthStore.getState().logout();
            }
          });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Auto-seed database
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length === 0) {
          fetch('/api/seed', { method: 'POST' })
            .then((r) => r.json())
            .then((seedData) => {
              console.log('Database seeded:', seedData.message);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) {
    return <LoadingScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        if (!isAuthenticated || !token) {
          return <AdminLogin />;
        }
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" key={currentPage}>
          {renderPage()}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
