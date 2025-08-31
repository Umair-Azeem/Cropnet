import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to CorpNet!",
        });
        if (user.role == 'admin') {
          navigate('/admin');
        } else if (user.role == 'farmer') {
          navigate('/dashboard');
        } else if (user.role == 'customer') {
          navigate('/shop');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // toast({
      //   title: "Login Error",
      //   description: "An error occurred during login. Please try again.",
      //   variant: "destructive",
      // });
      console.log("[Login.tsx] -> error =>", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  if (user) {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'farmer') navigate('/dashboard');
    else if (user.role === 'customer') navigate('/shop');
  }
}, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/30 to-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="bg-gradient-primary p-3 rounded-xl">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="font-poppins font-bold text-2xl text-primary">CorpNet</span>
          </div>
          <p className="text-muted-foreground mt-2">Agricultural E-commerce Platform</p>
        </div>

        <Card className="card-elevated">
          <CardHeader className="text-center pb-6">
            <CardTitle className="font-poppins text-2xl">Welcome Back</CardTitle>
            <p className="text-muted-foreground">Sign in to your account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="farmer@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              {/* <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div> */}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link to="/register">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-secondary/50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm mb-3 text-center">Demo Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="font-medium">Farmer Account:</p>
                <p>Email: farmer@demo.com</p>
                <p>Password: farmer123</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Customer Account:</p>
                <p>Email: customer@demo.com</p>
                <p>Password: customer123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}