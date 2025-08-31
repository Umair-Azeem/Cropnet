import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { ProductForm } from '@/components/ProductForm';
import { FarmerOfferForm } from '@/components/FarmerOfferForm';
import { FarmerOfferCard } from '@/components/FarmerOfferCard';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useCreateProduct } from '@/hooks/useProducts';
import { useFarmerOffers, useDeleteFarmerOffer } from '@/hooks/useFarmerOffers';


import { useAuth } from '@/contexts/AuthContext';
import {
  Plus,
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  Megaphone,
  Loader2,
} from 'lucide-react';
import { Product } from '@/types';
import axios from 'axios';

export default function FarmerDashboard() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: farmerOffers = [], isLoading: offersLoading } = useFarmerOffers();
  const createProduct = useCreateProduct();
  const deleteOffer = useDeleteFarmerOffer();

  // const myProducts = products.filter((product) => product.farmer._id === user?._id);

  // const stats = [
  //   { label: 'Total Products', value: 10, icon: Package, color: 'text-blue-600' },
  //   { label: 'Total Sales', value: '₹25,480', icon: DollarSign, color: 'text-green-600' },
  //   { label: 'Orders This Month', value: '48', icon: ShoppingBag, color: 'text-purple-600' }
  // ];

  const handleProductSubmit = async (product: any) => {
    try {
      const productData = {
        ...product,
        unit: Number(product.unit) || 0,
        farmer: {
          _id: user?._id || '',
          name: user?.name || 'Unknown',
        },
        location: user?.location || 'Unknown',
        organic: product?.organic ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product;

      await createProduct.mutateAsync(productData as any);

      setIsAddingProduct(false);
      setEditingProduct(null);
    } catch (error) {
      // Handle error silently
    }
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleProductDelete = (productId: string) => {
    toast({
      title: 'Product Deleted',
      description: 'Product has been removed from your inventory.',
    });
  };

  const handleOfferSubmit = () => {
    setIsAddingProduct(false);
    toast({
      title: 'Offer Submitted',
      description: 'Your offer has been submitted to admin for review.',
    });
  };

  const handleOfferDelete = async (offerId: string) => {
    try {
      await deleteOffer.mutateAsync(offerId);
    } catch (error) { }
  };


  const [singleFarmerOffers, setSingleFarmerOffers] = useState([]);

  const getSingleFarmerOffers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/farmer-offers`);
      console.log("[FarmerDashboard.tsx] api/farmeroffer -> response.data=>", response.data);
      // setSinglefarmerOffers(response.data.data);
      // const farmerOffers = response.data.filter(
      //   (offer) => offer.createdBy === user._id
      // );
      // setSingleFarmerOffers(farmerOffers);

      setSingleFarmerOffers(response.data);



    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e)
    }
  }





  const [stats, setStats] = useState([]);

  const getFarmerAnalytics = async () => {
    try {
      // const response = await axios.get(`http://192.168.18.28:5000/api/farmer-offers/search/email?email=${user.email}`);
      const response = await axios.get(`http://localhost:5000/api/farmer-offers/search/contact?createdBy=${user.email}`);
      console.log("[FarmerDashboard.tsx] api/farmer-offers/search/email -> response.data=>", response.data);
      // setTotalOffers(response.data.totalOffers);
      // setActiveOffers(response.data.activeOffers);
      // setTotalSum(response.data.approvedAmountSum);
      // setSinglefarmerOffers(response.data.data);
      // const farmerOffers = response.data.filter(
      //   (offer) => offer.createdBy === user._id
      // );
      // setSingleFarmerOffers(farmerOffers);

      // setFarmerAnalytics(response.data);

      const tempData = [
        { label: 'Total Products', value: response.data.activeOffers, icon: Package, color: 'text-blue-600' },
        { label: 'Total Sales', value: response.data.approvedAmountSum, icon: DollarSign, color: 'text-green-600' },
        { label: 'Orders This Month', value: response.data.totalOffers, icon: ShoppingBag, color: 'text-purple-600' }
      ];

      setStats(tempData);


    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e)
    }
  }

  useEffect(() => {
    getFarmerAnalytics();
    getSingleFarmerOffers();
  }, [isAddingProduct])

  useEffect(() => {
    getSingleFarmerOffers();
    getFarmerAnalytics();
  }, [])



  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-poppins font-bold text-3xl mb-2">Farmer Dashboard</h1>
              <p className="text-primary-foreground/80">Manage your products and offers</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsAddingProduct(true)} className="bg-white/20 hover:bg-white/30">
                <Plus className="h-4 w-4 mr-2" />
                Submit Offer
              </Button>
              {/* <Button onClick={() => setIsCreatingOffer(true)} variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Megaphone className="h-4 w-4 mr-2" />
                Submit Offer
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* <Tabs defaultValue="products" className="space-y-6"> */}
        {/* <TabsList className="grid w-full grid-cols-3"> */}
        {/* <TabsTrigger value="products">My Products</TabsTrigger> */}
        {/* <TabsTrigger value="offers">My Offers</TabsTrigger> */}
        {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        {/* </TabsList> */}

        {/* <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-semibold text-2xl">My Products</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            ) : myProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    userType="farmer"
                    isOwner={true}
                    onEdit={handleProductEdit}
                    onDelete={handleProductDelete}
                  />
                ))}
              </div>
            ) : (
              <Card className="card-elevated text-center py-16">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-poppins font-semibold text-xl mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first product to the marketplace.</p>
                  <Button onClick={() => setIsAddingProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent> */}

        {/* <TabsContent value="offers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-semibold text-2xl">My Offers to Admin</h2>
              <Button onClick={() => setIsCreatingOffer(true)}>
                <Megaphone className="h-4 w-4 mr-2" />
                Submit New Offer
              </Button>
            </div>

            {singleFarmerOffers.length > 0 ? (
              // {console.log:}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {singleFarmerOffers.map((offer) => (
                  <FarmerOfferCard
                    key={offer._id}
                    offer={offer}
                    userType="farmer"
                    onUpdate={() => { }}
                  />
                  // <h1>hi</h1>
                ))}
              </div>
            ) : (
              <Card className="card-elevated text-center py-16">
                <CardContent>
                  <Megaphone className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-poppins font-semibold text-xl mb-2">No offers submitted</h3>
                  <p className="text-muted-foreground mb-4">Submit offers to admin for bulk purchases and special deals.</p>
                  <Button onClick={() => setIsCreatingOffer(true)}>
                    <Megaphone className="h-4 w-4 mr-2" />
                    Submit Your First Offer
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent> */}

        {/* <TabsContent value="analytics" className="space-y-6">
            <h2 className="font-poppins font-semibold text-2xl">Analytics</h2>
            <Card className="card-elevated">
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-8">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent> */}
        {/* </Tabs> */}
        <div className="flex items-center justify-between">
          <h2 className="font-poppins font-semibold text-2xl">My Offers to Admin</h2>
          {/* <Button onClick={() => setIsCreatingOffer(true)}>
            <Megaphone className="h-4 w-4 mr-2" />
            Submit New Offer
          </Button> */}
        </div>

        {singleFarmerOffers.length > 0 ? (
          // {console.log:}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {singleFarmerOffers.map((offer) => (
              <FarmerOfferCard
                key={offer._id}
                offer={offer}
                userType="farmer"
                onUpdate={() => { }}
              />
              // <h1>hi</h1>
            ))}
          </div>

        ) : (


          <Card className="card-elevated text-center py-16">
            <CardContent>
              <Megaphone className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-poppins font-semibold text-xl mb-2">No offers submitted</h3>
              <p className="text-muted-foreground mb-4">Submit offers to admin for bulk purchases and special deals.</p>

            </CardContent>
          </Card>
        )}
      </div>

      {/* {isAddingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              mode={editingProduct ? 'edit' : 'add'}
              userType="farmer"
              currentFarmer={user?._id || ''}
              currentLocation={user?.location || ''}
              // onSubmit={(product) => {
              //   const fullProduct = editingProduct
              //     ? { ...editingProduct, ...product }
              //     : {
              //       ...product,
              //       _id: '',
              //       stock: (product as any).stock ?? 0,
              //       unit: (product as any).unit ?? '',
              //       createdAt: new Date().toISOString(),
              //       updatedAt: new Date().toISOString(),
              //     };
              //   void handleProductSubmit(fullProduct);
              // }}
              onCancel={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
              product={editingProduct || undefined}
            />
          </div>
        </div>
      )} */}

      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <FarmerOfferForm onSuccess={handleOfferSubmit} onCancel={() => setIsAddingProduct(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
