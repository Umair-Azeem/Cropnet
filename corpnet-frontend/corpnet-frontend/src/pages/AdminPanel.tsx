import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductForm } from '@/components/ProductForm';
import { FarmerOfferCard } from '@/components/FarmerOfferCard';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useCreateProduct } from '@/hooks/useProducts';
import { useAllFarmerOffers } from '@/hooks/useFarmerOffers';
import { useUsers, useDeleteUser, useToggleUserStatus } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Package,
  ShoppingBag,
  Search,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  DollarSign,
  Calendar,
  MapPin,
  Plus,
  Megaphone,
  Loader2,
  Edit
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard';
import { AnalyticsData } from '@/types';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface OrderToShow {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  createdAt: string;
}

// -----------------------------
// 🔥 Order Status Badge Helper
// -----------------------------
const getOrderStatusBadge = (status: string) => {
  const statusConfig = {
    notapproved: { color: 'bg-yellow-100 text-yellow-800', label: 'Not Approved' },
    approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    cancel: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    };

  return (
    <Badge className={`${config.color} px-2 py-1 rounded`}>
      {config.label}
    </Badge>
  );
};

// Create a separate component for the Stats Cards to improve readability
const StatsCards = ({ stats, totalRevenue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  {stat.label === 'Revenue' ? (
                    <p className="text-2xl font-bold">Rs. {totalRevenue}</p>
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Create a separate component for the Orders table
const OrdersTable = ({ orders, loading, handleStatusSave, isStatusDialogOpen, setIsStatusDialogOpen }) => {
  const [statusValue, setStatusValue] = useState("");

  const extractCategoriesFromProductsArray = useCallback((productsArray: any) => {
    if (productsArray?.length > 0) {
      const validCategories = productsArray
        .map(p => p?.product?.category)
        .filter(category => category != null);

      if (validCategories.length === 0) {
        return null;
      }

      const categories = [...new Set(validCategories)];
      return categories.length === 1
        ? categories[0]
        : categories.join(" / ");
    }
    return null;
  }, []);

  const extractProductsQuantityFromProductsArray = useCallback((productsArray: any) => {
    let count = 0;
    for (let i = 0; i < productsArray.length; i++) {
      count = count + productsArray[i].quantity;
    }
    return count;
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>       {/* ✅ */}
    <th className="px-4 py-2 border">Address</th>     {/* ✅ */}
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Quantity</th>
            <th className="px-4 py-2 border">Total Amount</th>
            <th className="px-4 py-2 border">Created At</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? orders.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 border">{order?.customer?.name}</td>
              <td className="px-4 py-2 border">{order?.customer?.email}</td>
               <td className="px-4 py-2 border">{order?.customer?.phone || "N/A"}</td>     {/* ✅ */}
      <td className="px-4 py-2 border">{order?.customer?.address || "N/A"}</td>   {/* ✅ */}
              <td className="px-4 py-2 border">{extractCategoriesFromProductsArray(order?.products)}</td>
              <td className="px-4 py-2 border">{extractProductsQuantityFromProductsArray(order?.products)}</td>
              <td className="px-4 py-2 border">{order?.totalAmount}</td>
              <td className="px-4 py-2 border">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">
                {/* 🔥 Show colored badge */}
                {getOrderStatusBadge(order?.status)}
              </td>
              <td className="px-4 py-2 border">
                <Dialog open={isStatusDialogOpen === order._id} onOpenChange={(open) => setIsStatusDialogOpen(open ? order._id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">
                      Edit Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Edit Order Status</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <label className="block mb-2 font-medium text-sm">Status</label>
                      <select
                        value={statusValue}
                        onChange={(e) => setStatusValue(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="notapproved">Not Approved</option>
                        <option value="approved">Approved</option>
                        <option value="cancel">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button
                        className="flex-1"
                        onClick={() => handleStatusSave(order._id, statusValue)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsStatusDialogOpen(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  );
};

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [selectedUserStatus, setSelectedUserStatus] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allFarmerOffers, setAllFarmerOffers] = useState([]);
  const [orders, setOrders] = useState<OrderToShow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("notapproved");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // API hooks
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: farmerOffersData, isLoading: offersLoading } = useAllFarmerOffers({
    status: selectedStatus || undefined,
    category: selectedCategory || undefined
  });
  const { data: usersData, isLoading: usersLoading } = useUsers({
    role: selectedUserRole || undefined,
    status: selectedUserStatus || undefined
  });

  const farmerOffers = farmerOffersData?.data || [];
  const users = usersData?.data || [];
  const createProduct = useCreateProduct();
  const deleteUser = useDeleteUser();
  const toggleUserStatus = useToggleUserStatus();

  // Analytics data
  const analyticsData: AnalyticsData = {
    revenue: { current: 456789, previous: 371234, change: 23 },
    orders: { current: 8921, previous: 7756, change: 15 },
    users: { current: 1247, previous: 1113, change: 12 },
    products: { current: products.length, previous: 3202, change: 8 },
    topCategories: [
      { name: 'Vegetables', value: 1456, percentage: 42 },
      { name: 'Fruits', value: 987, percentage: 29 },
      { name: 'Grains', value: 654, percentage: 19 },
      { name: 'Spices', value: 359, percentage: 10 }
    ],
    monthlyData: [
      { month: 'Jan 2024', revenue: 76123, orders: 1487, users: 89 },
      { month: 'Dec 2023', revenue: 69874, orders: 1398, users: 76 },
      { month: 'Nov 2023', revenue: 71234, orders: 1456, users: 92 }
    ]
  };

  const stats = useMemo(() => [
    { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-600' },
    { label: 'Total Products', value: allProducts.length, icon: Package, color: 'text-green-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-purple-600' },
    { label: 'Revenue', value: `Rs. ${totalRevenue}`, icon: DollarSign, color: 'text-orange-600' }
  ], [allUsers.length, allProducts.length, orders.length, totalRevenue]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser.mutateAsync(userId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      toast({
        title: "Product Deleted",
        description: "Product has been removed from the marketplace.",
      });
      // Refresh products list
      getAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
      });
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus.mutateAsync(userId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: UserCheck },
      inactive: { color: 'bg-red-100 text-red-800', icon: UserX },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleProductSubmit = async (productAdd: any) => {
    console.log("[AdminPanel.tsx] submit -> product =>", productAdd);
  };

  const filteredUsers = useMemo(() => 
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [users, searchTerm]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setAllUsers(response.data.data);
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e);
    }
  };

  const getAllProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setAllProducts(response.data.data);
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const getAllFarmerOffers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/farmer-offers");
      setAllFarmerOffers(response.data);
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e);
    }
  };

  const getAllAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/inventory/getdashboard");
      // We'll use the stats memo instead
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e);
    }
  };

  const getRevenue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders/revenue");
      setTotalRevenue(response.data.totalRevenue);
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e);
    }
  };

  const handleStatusSave = async (orderId, newStatus) => {
    try {
      // Optimistic UI update
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );

      // API call
      await axios.put(
        `http://localhost:5000/api/orders/status`,
        {},
        {
          params: { id: orderId, status: newStatus },
        }
      );
      
      // Close status dialog
      setIsStatusDialogOpen(null);

      // Success toast
      toast({
        title: "Status Updated",
        description: `Order status changed to "${newStatus}".`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getAllAnalytics(),
          getAllFarmerOffers(),
          getAllUsers(),
          getAllProducts(),
          getRevenue()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders/all")
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-poppins font-bold text-3xl mb-2">Admin Panel</h1>
              <p className="text-primary-foreground/80">Manage the entire platform</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsAddingProduct(true)}
                className="bg-white/20 hover:bg-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} totalRevenue={totalRevenue} />

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="farmer-offers">Farmer Offers</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersTable 
                  orders={orders} 
                  loading={loading} 
                  handleStatusSave={handleStatusSave}
                  isStatusDialogOpen={isStatusDialogOpen}
                  setIsStatusDialogOpen={setIsStatusDialogOpen}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-semibold text-2xl">User Management</h2>
            </div>

            <Card className="card-elevated">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">User</th>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          {user.role !== 'admin' && (
                            <td className="p-4">
                              <Badge variant={user.role === 'farmer' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                          )}
                          <td className="p-4">
                            {getStatusBadge(user.isActive ? 'active' : 'inactive')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-semibold text-2xl">Product Management</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {isLoadingProducts ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            ) : allProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    userType="admin"
                    isOwner={false}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <Card className="card-elevated text-center py-16">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-poppins font-semibold text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    No products have been added to the marketplace yet.
                  </p>
                  <Button onClick={() => setIsAddingProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Farmer Offers Tab */}
          <TabsContent value="farmer-offers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-semibold text-2xl">Farmer Offers</h2>
            </div>

            {allFarmerOffers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allFarmerOffers.map((offer) => (
                  <FarmerOfferCard
                    key={offer._id}
                    offer={offer}
                    userType="admin"
                    onUpdate={getAllFarmerOffers}
                  />
                ))}
              </div>
            ) : (
              <Card className="card-elevated text-center py-16">
                <CardContent>
                  <Megaphone className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-poppins font-semibold text-xl mb-2">No farmer offers</h3>
                  <p className="text-muted-foreground">
                    No farmer offers have been submitted yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              mode="add"
              userType="admin"
              onCancel={() => setIsAddingProduct(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}