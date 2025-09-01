import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Heart,
  Clock,
  CheckCircle,
  MapPin,
  Truck,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItems, setCartItems] = useState<Array<{ productId: string, quantity: number }>>([]);
  const [cartItemsInDetail, setCartItemsInDetail] = useState([]);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const { user } = useAuth();

  const { toast } = useToast();
 const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  // Mock data
  const products = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      description: 'Fresh organic tomatoes grown without pesticides. Perfect for salads and cooking.',
      price: 40,
      quantity: 100,
      category: 'Vegetables',
      farmer: 'John Farmer',
      location: 'Punjab, India',
      rating: 4.5,
      organic: true
    },
    {
      id: '2',
      name: 'Basmati Rice',
      description: 'Premium quality basmati rice with long grains and aromatic fragrance.',
      price: 80,
      quantity: 50,
      category: 'Grains',
      farmer: 'Priya Singh',
      location: 'Haryana, India',
      rating: 4.8,
      organic: false
    },
    {
      id: '3',
      name: 'Fresh Apples',
      description: 'Crisp and sweet red apples, freshly harvested from mountain orchards.',
      price: 120,
      quantity: 75,
      category: 'Fruits',
      farmer: 'Mountain Farms',
      location: 'Himachal Pradesh, India',
      rating: 4.6,
      organic: true
    },
    {
      id: '4',
      name: 'Turmeric Powder',
      description: 'Pure turmeric powder with no artificial colors or preservatives.',
      price: 200,
      quantity: 30,
      category: 'Spices',
      farmer: 'Spice Gardens',
      location: 'Kerala, India',
      rating: 4.9,
      organic: true
    }
  ];

  const recentOrders = [
    {
      id: '1',
      items: ['Organic Tomatoes', 'Basmati Rice'],
      amount: 320,
      date: '2024-01-15',
      status: 'Delivered',
      farmer: 'John Farmer'
    },
    {
      id: '2',
      items: ['Fresh Apples'],
      amount: 240,
      date: '2024-01-12',
      status: 'In Transit',
      farmer: 'Mountain Farms'
    },
    {
      id: '3',
      items: ['Turmeric Powder'],
      amount: 200,
      date: '2024-01-10',
      status: 'Processing',
      farmer: 'Spice Gardens'
    }
  ];

  const stats = [
    { label: 'Total Orders', value: '12', icon: Package, color: 'text-green-600' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string, quantity: number) => {
    let updatedCart;

    const existingItem = cartItems.find(item => item.productId === productId);

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cartItems, { productId, quantity }];
    }

    setCartItems(updatedCart); // ✅ Update state

    // Use the updated cart to get full product details
    const cartFullProducts = updatedCart
      .map(cartItem => {
        const product = allProducts.find(p => p._id === cartItem.productId);
        if (!product) return null;

        return {
          ...product,
          quantity: cartItem.quantity,
          totalPrice: product.price * cartItem.quantity,
        };
      })
      .filter(Boolean); // remove any nulls if product not found

    const product = allProducts.find(p => p._id === productId);

    console.log("[CustomerDashboard.tsx] cartFullProducts => ", cartFullProducts);
    setCartItemsInDetail(cartFullProducts);

    toast({
      title: "Added to Cart",
      description: `${quantity} ${product?.name} added to your cart.`,
    });
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      console.log("[CustomerDashbaord.tsx] api/products -> response.data.data=>", response.data.data);
      setAllProducts(response.data.data);
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e)
    }
  }

  useEffect(() => {
    getAllProducts();
  }, [])


  const handleCheckout = async () => {
    console.log("[CustomerDashbaord.tsx] => ", "handling checkout")


    let productsWithQuantity = []
    cartItemsInDetail.forEach((item) => {
      productsWithQuantity.push({
        product: item._id,
        quantity: item.quantity
      })
    })

    console.log("[CustomerDashboard.tsx] checkout body =>", {
      customer: user._id,
      products: productsWithQuantity,
      totalAmount: cartItemsInDetail.reduce((sum, item) => sum + item.totalPrice, 0),
      status: "notapproved",
    })

    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        customer: user._id,
        products: productsWithQuantity,
        totalAmount: cartItemsInDetail.reduce((sum, item) => sum + item.totalPrice, 0),
        status: "notapproved",
      });
      console.log("[CustomerDashbaord.tsx] api/orders -> response.data=>", response.data);
      // setAllProducts(response.data.data);
      toast({
        title: "Success",
        description: `Checkout has been done`,
      });
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e)
    }
  }

  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  const getOrdersCount = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/count/user/${user._id}`);
      console.log("[CustomerDashbaord.tsx] api/orders/count/user -> response.data=>", response.data);
      // setAllProducts(response.data.data);
      setTotalOrdersCount(response.data.orderCount);
    } catch (e) {
      console.log("[CustomerDashboard.tsx] api/orders/count/user -> error=>", e)
    }
  }


  const [customerOrders, setCustomerOrders] = useState([]);
 const getCustomerOrders = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/orders/all");
    console.log("[CustomerDashboard] API response:", response.data);

    const allOrders = response.data?.data || [];

    const loggedInCustomerOrders = allOrders.filter(
      (item) => item?.customer?._id === user?._id
    );

    console.log("[CustomerDashboard] filtered orders:", loggedInCustomerOrders);

    setCustomerOrders(loggedInCustomerOrders);
  } catch (error) {
    console.error("[CustomerDashboard] Failed to fetch orders:", error);
  }
};

useEffect(() => {
  if (user?._id) {
    getCustomerOrders();
    getOrdersCount();
  }
}, [user]);


  const extractProductsQuantityFrinProductsArray = (productsArray: any) => {

    let count = 0;

    for (var i = 0; i < productsArray.length; i++) {
      count = count + productsArray[i].quantity
    }

    return count;

  }


  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(null); // store order._id of open dialog
  const [statusValue, setStatusValue] = useState("");
  const [orders,setOrders] = useState([]);

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

      // Error toast
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive", // optional, if using shadcn's destructive style
      });
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins font-bold text-3xl text-primary mb-2">
            Customer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Discover fresh agricultural products from local farmers.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    {stat.label == 'Total Orders' ? (<p className="text-2xl font-bold font-poppins">{totalOrdersCount}</p>) : (
                      <p className="text-2xl font-bold font-poppins">{stat.value}</p>
                    )}

                  </div>
                  <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search and Filter */}
            {/* <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Browse Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="md:w-48">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card> */}

            {/* Products Grid */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Available Products ({allProducts?.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {allProducts?.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {allProducts?.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product as any}
                        userType="customer"
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium text-lg mb-2">No products found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cartItems.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? (
                          <div key={item.productId} className="flex justify-between items-center text-sm">
                            <span>{product.name}</span>
                            <span>×{item.quantity}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Items:</span>
                        <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                    </div>
                    {/* <Button className="w-full btn-hero">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Cart
                    </Button> */}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            {/* <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Order #{order.id}</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="text-xs">{order.status}</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>{order.items.join(', ')}</p>
                        <div className="flex justify-between">
                          <span>{order.date}</span>
                          <span className="font-medium">₹{order.amount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>From {order.farmer}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}




          <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart Details ({cartItemsInDetail.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Shopping Cart
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium">
                    <div className="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total</div>
                  </div>
                  {cartItemsInDetail.map(product => (
                    <div key={product._id} className="grid grid-cols-5 gap-4 p-4 border-t">
                      <div className="col-span-2">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                      <div>Rs{product.price}</div>
                      <div>{product.quantity}</div>
                      <div className="font-medium">Rs{product.totalPrice}</div>
                    </div>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cash_on_delivery"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="cash_on_delivery" className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Cash on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="online_payment"
                        value="online_payment"
                        checked={paymentMethod === 'online_payment'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-primary"
                        disabled
                      />
                      <Label htmlFor="online_payment" className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Online Payment (Not Available)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Total and Checkout */}
                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span>Total Amount:</span>
                    <span>Rs{cartItemsInDetail.reduce((sum, item) => sum + item.totalPrice, 0)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCheckout} 
                      className="flex-1"
                      disabled={paymentMethod === 'online_payment'}
                    >
                      {paymentMethod === 'cash_on_delivery' 
                        ? 'Proceed with Cash on Delivery'
                        : 'Select Payment Method'
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsResponseDialogOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        

          </div>

        </div>
    <div className='my-5'>
  <Card className="card-elevated">
    <CardHeader>
      <CardTitle>Orders</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Total Amount</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerOrders?.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-2 border">
                  {extractProductsQuantityFrinProductsArray(order?.products)}
                </td>
                <td className="px-4 py-2 border">{order?.totalAmount}</td>

                <td className="px-4 py-2 border">
                  {order?.status}
                </td>

                <td className="px-4 py-2 border">
                  {order?.status !== "Delivered" && (
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusSave(order._id, "Delivered")}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</div>

      </div>
    </div>
  );
}