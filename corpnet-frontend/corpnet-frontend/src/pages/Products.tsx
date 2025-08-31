import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ProductCard } from '@/components/ProductCard';
import { 
  Search, 
  Package, 
  Leaf,
  SlidersHorizontal,
  MapPin,
  Star,
  Loader2
} from 'lucide-react';
import axios from 'axios';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const navigate = useNavigate();

  // Fetch products from API
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setAllProducts(response.data.data);  // API response structure
    } catch (err) {
      console.error("[Products.tsx] api/products -> error=>", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // -----------------------
  // Filtering + Sorting (Frontend only)
  // -----------------------
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || selectedCategory === "all" || product.category === selectedCategory;

      const matchesLocation =
        !selectedLocation || selectedLocation === "all" || product.farmerName?.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesOrganic = !organicOnly || product.isOrganic === true;

      return matchesSearch && matchesCategory && matchesLocation && matchesOrganic;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedLocation, organicOnly]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setOrganicOnly(false);
    setSortBy('');
  };

  // -----------------------
  // Add to Cart → Show Login Dialog
  // -----------------------
  const handleAddToCart = () => {
    setShowLoginDialog(true);
  };

  const handleConfirmLogin = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Leaf className="h-12 w-12" />
            </div>
          </div>
          <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-4">
            Fresh Agricultural Products
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Discover quality products directly from trusted farmers across India
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <Card className="card-elevated mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filter & Search Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products, farmers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {Array.from(new Set(allProducts.map(p => p.farmerName))).map((loc, idx) => (
                      <SelectItem key={idx} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Organic Filter */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="organic" className="text-sm font-medium">
                  Organic Only
                </label>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} className="ml-auto">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="font-poppins font-semibold text-2xl">
              Products ({sortedProducts.length})
            </h2>
            {organicOnly && (
              <Badge className="badge-organic">
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{sortedProducts.length} products found</span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                userType="customer"
                onAddToCart={handleAddToCart}  // ✅ Added here
              />
            ))}
          </div>
        ) : (
          <Card className="card-elevated text-center py-16">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-poppins font-semibold text-xl mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="card-elevated text-center">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-poppins font-semibold text-lg mb-2">3,000+ Products</h3>
              <p className="text-muted-foreground">Fresh agricultural products from verified farmers</p>
            </CardContent>
          </Card>

          <Card className="card-elevated text-center">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-poppins font-semibold text-lg mb-2">28 States</h3>
              <p className="text-muted-foreground">Farmers from across India delivering quality</p>
            </CardContent>
          </Card>

          <Card className="card-elevated text-center">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-poppins font-semibold text-lg mb-2">Lowest Prices</h3>
              <p className="text-muted-foreground">Trusted by thousands of satisfied customers</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🔐 Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            You must log in first to buy products.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmLogin}>Go to Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
