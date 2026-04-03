'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Star,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  Package,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { useNavigationStore } from '@/store/navigation';
import type { Product, Contact, Review, AdminStats, ProductFormData } from '@/types';

// Categories for display mapping
const categoryMap: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  custom: 'Custom',
  specialty: 'Specialty',
};

type AdminTab = 'dashboard' | 'products' | 'inquiries' | 'reviews';

const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'products', label: 'Products', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
];

const defaultProductForm: ProductFormData = {
  name: '',
  description: '',
  image: '/images/small-shipping-box.png',
  category: 'small',
  length: 12,
  width: 10,
  height: 6,
  basePrice: 1.5,
  inStock: true,
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= value ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const { setCurrentPage } = useNavigationStore();
  const token = useAuthStore((s) => s.token);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Product dialog
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(defaultProductForm);
  const [productSaving, setProductSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    type: 'product' | 'review';
    id: string;
    name: string;
  } | null>(null);

  // Inquiry expand
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  // Add review dialog
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);

  const authHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchDashboard = useCallback(async () => {
    try {
      const [statsRes, productsRes, contactsRes, reviewsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: authHeaders() }),
        fetch('/api/products'),
        fetch('/api/contacts', { headers: authHeaders() }),
        fetch('/api/reviews'),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts || []);
      }
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info('Logged out successfully');
  };

  // Product CRUD
  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    setProductSaving(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product added!');
        setProductDialogOpen(false);
        setEditingProduct(null);
        setProductForm(defaultProductForm);
        fetchDashboard();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save product');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setProductSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProductForm((prev) => ({ ...prev, image: data.imageUrl }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      const url =
        deleteDialog.type === 'product'
          ? `/api/products/${deleteDialog.id}`
          : `/api/reviews/${deleteDialog.id}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (res.ok) {
        toast.success(`${deleteDialog.type === 'product' ? 'Product' : 'Review'} deleted`);
        setDeleteDialog(null);
        fetchDashboard();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      length: product.length,
      width: product.width,
      height: product.height,
      basePrice: product.basePrice,
      inStock: product.inStock,
    });
    setProductDialogOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm(defaultProductForm);
    setProductDialogOpen(true);
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ id, read: !read }),
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, read: !read } : c))
        );
      }
    } catch {
      // silent fail
    }
  };

  const handleAddReview = async () => {
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setReviewSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      if (res.ok) {
        toast.success('Review added!');
        setReviewDialogOpen(false);
        setReviewName('');
        setReviewRating(5);
        setReviewComment('');
        fetchDashboard();
      } else {
        toast.error('Failed to add review');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setReviewSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-foreground text-background border-r border-background/10 p-4 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <Package className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">
            <span className="text-primary">Box</span>Craft
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-background/70 hover:bg-background/10 hover:text-background'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <Separator className="bg-background/10 mb-4" />

        <Button
          variant="ghost"
          className="w-full justify-start text-background/70 hover:bg-background/10 hover:text-background"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t px-2 py-2 flex items-center justify-around">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeTab === item.id
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="border-transparent bg-white/80">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Products</p>
                        <p className="text-2xl font-bold">{stats.totalProducts}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-transparent bg-white/80">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Inquiries</p>
                        <p className="text-2xl font-bold">
                          {stats.totalInquiries}
                          {stats.unreadInquiries > 0 && (
                            <Badge className="ml-2 bg-destructive text-white text-xs">
                              {stats.unreadInquiries} new
                            </Badge>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-transparent bg-white/80">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Reviews</p>
                        <p className="text-2xl font-bold">{stats.totalReviews}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-transparent bg-white/80">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                        <p className="text-2xl font-bold">
                          {stats.averageRating.toFixed(1)}
                          <span className="text-sm text-muted-foreground">/5</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Products */}
                <Card className="border-transparent bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Products</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <ScrollArea className="max-h-64">
                      <div className="space-y-3">
                        {products.slice(0, 5).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ${p.basePrice.toFixed(2)} · {p.category}
                              </p>
                            </div>
                            <Badge variant={p.inStock ? 'default' : 'destructive'} className="text-xs">
                              {p.inStock ? 'In Stock' : 'Out'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Recent Inquiries */}
                <Card className="border-transparent bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <ScrollArea className="max-h-64">
                      <div className="space-y-3">
                        {contacts.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No inquiries yet
                          </p>
                        )}
                        {contacts.slice(0, 5).map((c) => (
                          <div
                            key={c.id}
                            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors ${
                              !c.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {c.message}
                              </p>
                            </div>
                            {!c.read && (
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Button
                  onClick={openNewProduct}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <Card className="border-transparent bg-white/80">
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[calc(100vh-12rem)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Category</TableHead>
                          <TableHead className="hidden md:table-cell">Size</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="secondary" className="capitalize">
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {product.length}&quot;×{product.width}&quot;×{product.height}&quot;
                            </TableCell>
                            <TableCell>${product.basePrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={product.inStock ? 'default' : 'destructive'}>
                                {product.inStock ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEditProduct(product)}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    setDeleteDialog({
                                      type: 'product',
                                      id: product.id,
                                      name: product.name,
                                    })
                                  }
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'inquiries' && (
            <motion.div
              key="inquiries"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-6">Inquiries</h1>

              <Card className="border-transparent bg-white/80">
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[calc(100vh-12rem)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Phone</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="hidden sm:table-cell">Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No inquiries yet
                            </TableCell>
                          </TableRow>
                        )}
                        {contacts.map((contact) => (
                          <TableRow
                            key={contact.id}
                            className={`cursor-pointer ${!contact.read ? 'bg-primary/5' : ''}`}
                            onClick={() =>
                              setExpandedInquiry(
                                expandedInquiry === contact.id ? null : contact.id
                              )
                            }
                          >
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">{contact.phone}</TableCell>
                            <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {expandedInquiry === contact.id
                                ? contact.message
                                : contact.message.slice(0, 50) + (contact.message.length > 50 ? '...' : '')}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkRead(contact.id, contact.read);
                                }}
                              >
                                {contact.read ? (
                                  <EyeOff className="w-3.5 h-3.5 mr-1" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                )}
                                {contact.read ? 'Read' : 'Unread'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Reviews</h1>
                <Button
                  onClick={() => {
                    setReviewName('');
                    setReviewRating(5);
                    setReviewComment('');
                    setReviewDialogOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Review
                </Button>
              </div>

              <Card className="border-transparent bg-white/80">
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[calc(100vh-12rem)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Comment</TableHead>
                          <TableHead className="hidden sm:table-cell">Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell className="font-medium">{review.name}</TableCell>
                            <TableCell>
                              <StarRating value={review.rating} />
                            </TableCell>
                            <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground">
                              {review.comment}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() =>
                                  setDeleteDialog({
                                    type: 'review',
                                    id: review.id,
                                    name: review.name,
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update the product details below.'
                : 'Fill in the details to add a new product.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-3">
                <img
                  src={productForm.image}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <div className="flex-1">
                  <Input
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="Image URL"
                    className="mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button variant="outline" size="sm" type="button" asChild>
                        <span>
                          {uploadingImage ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3 mr-1" />
                          )}
                          Upload
                        </span>
                      </Button>
                    </label>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Small Shipping Box"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) =>
                  setProductForm((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Length (in)</Label>
                <Input
                  type="number"
                  value={productForm.length}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      length: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Width (in)</Label>
                <Input
                  type="number"
                  value={productForm.width}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      width: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Height (in)</Label>
                <Input
                  type="number"
                  value={productForm.height}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      height: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Base Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={productForm.basePrice}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    basePrice: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>In Stock</Label>
              <Switch
                checked={productForm.inStock}
                onCheckedChange={(checked) =>
                  setProductForm((prev) => ({ ...prev, inStock: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={productSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {productSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
            <DialogDescription>Add a new customer review.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comment</Label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Review comment..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddReview}
              disabled={reviewSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {reviewSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDialog?.type === 'product' ? 'Product' : 'Review'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog?.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
