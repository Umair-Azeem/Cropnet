import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Leaf,
  User,
  LogOut,
  Home,
  Package,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  isLoggedIn?: boolean;
  userType?: "farmer" | "customer" | "admin";
  cartItems?: number;
  onLogout?: () => void;
}

export function Navbar({
  isLoggedIn = false,
  userType = "customer",
  cartItems = 0,
  onLogout,
}: NavbarProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

const NavLinks = () => (
  <>
    {/* Home */}
    <Link
      to="/"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive("/") ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
      }`}
    >
      <Home className="h-4 w-4" />
      Home
    </Link>

    {/* Show Products only if NOT logged in */}
    {!user && (
      <Link
        to="/products"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isActive("/products")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-secondary"
        }`}
      >
        <Package className="h-4 w-4" />
        Products
      </Link>
    )}

    {/* Auth Links */}
    {!user ? (
      <>
        <Link
          to="/login"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isActive("/login")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          <User className="h-4 w-4" />
          Login
        </Link>
        <Link
          to="/register"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isActive("/register")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          <User className="h-4 w-4" />
          Register
        </Link>
      </>
    ) : (
      <>
        {user.role === "admin" && (
          <Link
            to="/admin"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive("/admin")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </>
    )}
  </>
);


  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-poppins font-bold text-xl text-primary">
              CropNet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="bg-gradient-primary p-2 rounded-lg">
                    <Leaf className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-poppins font-bold text-xl text-primary">
                    CropNet
                  </span>
                </div>
                <Separator className="mb-6" />
                <div className="flex flex-col space-y-3">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
