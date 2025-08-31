import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ContactUs from "./pages/ContactUs";
import Footer from "@/components/Footer"; 
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ChatbotPOC from "./components/ChatbotPOC";
import CustomChatbotSidebar from "./components/CustomChatbotSidebar";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // const navigate = useNavigate();

  const [navList, setNavList] = useState([
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
    // location.reload(); // Reload to reset state
    // Navigate
    //  navigate('/admin');
    // navList
    setNavList([
      { name: "Home", path: "/" },
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
    ]);
  };

  // ✅ Update navbar depending on role + auth
  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      setNavList([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
      ]);
    } else if (isAuthenticated && (user?.role === "farmer" || user?.role === "admin")) {
      setNavList([
        { name: "Home", path: "/" },
      ]);
    } else {
      // not logged in
      setNavList([
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ]);
    }
  }, [isAuthenticated, user]);

  console.log("[App.tsx] user =>", user);

  return (
    <BrowserRouter>
      <Navbar
        navlist={navList}
        isLoggedIn={isAuthenticated}
        userType={user?.role || "customer"}
        cartItems={0}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route 
          path="/dashboard" 
          element={
            user?.role === 'farmer' ? (
              <FarmerDashboard />
            ) : user?.role === 'admin' ? (
              <AdminPanel />
            ) : (
              <CustomerDashboard />
            )
          } 
        /> */}
        {/* {user?.role == "admin" ? (<Route path="/admin" element={<AdminPanel />} />) : (null)} */}
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/shop" element={<CustomerDashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
          {/* <ChatbotPOC ></ChatbotPOC> */}
          <CustomChatbotSidebar></CustomChatbotSidebar>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
