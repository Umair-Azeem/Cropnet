import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Leaf, 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Shield,
  Truck,
  Star
} from 'lucide-react';
import heroImage from '@/assets/hero-agriculture.jpg';
import CustomChatbotSidebar from '@/components/CustomChatbotSidebar';

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const features = [
    {
      icon: Users,
      title: "Connect Farmers & Customers",
      description: "Direct connection between farmers and customers, eliminating middlemen"
    },
    {
      icon: Package,
      title: "Fresh Quality Products",
      description: "Farm-fresh agricultural products delivered straight from the source"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Safe and secure payment methods with buyer protection"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep"
    }
  ];

  const stats = [
    { label: "Active Farmers", value: "1,200+", icon: Users },
    { label: "Happy Customers", value: "5,000+", icon: Star },
    { label: "Products Listed", value: "10,000+", icon: Package },
    { label: "Orders Delivered", value: "25,000+", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* <CustomChatbotSidebar /> */}
       
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Leaf className="h-12 w-12" />
            </div>
          </div>
          
          <h1 className="font-poppins font-bold text-5xl md:text-6xl mb-6 leading-tight">
            Welcome to <span className="text-accent">CropNet</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Connecting farmers directly with customers for fresh, quality agricultural products
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-hero min-w-[200px]">
                <Users className="h-5 w-5 mr-2" />
                Join as Farmer
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <Button 
    size="lg" 
    variant="outline" 
    className="min-w-[200px] bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
    onClick={() => setIsDialogOpen(true)}
  >
    <ShoppingCart className="h-5 w-5 mr-2" />
    Shop Products
  </Button>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Register First</DialogTitle>
    </DialogHeader>
    <p className="mt-2 text-gray-600">
      You need to register before you can see and shop products.
    </p>
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
        Cancel
      </Button>
      <Link to="/register">
        <Button>Register Now</Button>
      </Link>
    </div>
  </DialogContent>
</Dialog>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-4 text-primary">
              Why Choose CorpNet?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform revolutionizes agricultural commerce by creating direct connections 
              and ensuring fair prices for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-elevated text-center hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-poppins text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto bg-white/20 p-3 rounded-full w-fit mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="font-poppins font-bold text-2xl md:text-3xl mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-4 text-primary">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start buying or selling agricultural products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* For Farmers */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="font-poppins text-xl text-primary flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  For Farmers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p>Register as a farmer and set up your profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p>List your agricultural products with details and pricing</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p>Receive orders and manage your inventory</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p>Get paid directly for your products</p>
                </div>
              </CardContent>
            </Card>

            {/* For Customers */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="font-poppins text-xl text-primary flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  For Customers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p>Browse fresh products from local farmers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p>Add items to cart and place your order</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p>Choose your preferred payment method</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p>Receive fresh products at your doorstep</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-4 text-primary">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and customers who are already part of the CorpNet community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-hero min-w-[200px]">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}