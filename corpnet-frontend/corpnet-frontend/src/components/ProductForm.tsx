import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Package,
  Plus,
  X
} from 'lucide-react';
import axios from 'axios';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  category: string;
  farmer: {
    _id: string;
    name: string;
  };
  location?: string;
  organic?: boolean;
  image?: string;
}

interface ProductFormProps {
  product?: Product;
  mode: 'add' | 'edit';
  userType: 'admin' | 'farmer';
  currentFarmer?: string;
  currentLocation?: string;
  // onSubmit: (product: Product) => void;
  onCancel: () => void;
}

interface productAdd {
  name: string,
  description: string,
  price: number,
  quantity: number,
  category: string,
  unit?: 'kg'
}

export function ProductForm({
  product,
  mode,
  userType,
  currentFarmer = '',
  currentLocation = '',
  // onSubmit,

  onCancel
}: ProductFormProps) {
  const [formData, setFormData] = useState<productAdd>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: '',
    unit: 'kg'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Vegetables',
    'Fruits'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const postImage = async (productId) => {
    try {
    const res = await axios.post(
      `http://localhost:5000/api/products/image/${productId}`, 
      { image: preview },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Image updated:", res.data);
  } catch (error) {
    console.error("❌ Failed to update image:", error.response?.data || error.message);
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || formData.price <= 0 || formData.quantity < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    console.log("[ProductForm.tsx] formData => ", formData);

    // Simulate API call
    try {
      const response = await axios.post("http://localhost:5000/api/products ", formData);
      console.log("[ProductForm.tsx] api/products response.data =>", response.data);
      setIsSubmitting(false);
      if(response.data){
        postImage(response.data.data._id);
      }
      toast({
        title: mode === 'add' ? "Product Added" : "Product Updated",
        description: `${formData.name} has been ${mode === 'add' ? 'added' : 'updated'} successfully.`,
      })
    } catch (e) {
      console.log("[ProductForm.tsx] -> error =>", e);
      setIsSubmitting(true);
    }

    // setTimeout(() => {
    //   // onSubmit(formData);

    // }, 1000);
  };

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG and JPEG files are allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Preview image
      console.log(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Organic Tomatoes"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product in detail..."
              rows={3}
              required
            />
          </div>

          {/* Price and Quantity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per Unit *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="40.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Available Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="100"
                required
              />
            </div>
          </div>

          {/* Farmer and Location (Admin only) */}
          {/* {userType === 'admin' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmer">Farmer Name</Label>
                <Input
                  id="farmer"
                  name="farmerName"
                  value={formData.farmer.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      farmer: { ...prev.farmer, name: e.target.value },
                    }))
                  }
                  placeholder="Farmer name"
                />

              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              </div>
            </div>
          )} */}

          {/* Organic Toggle */}
          {/* <div className="flex items-center space-x-3">
            <Switch
              id="organic"
              checked={formData.organic}
              onCheckedChange={(checked) => handleSwitchChange('organic', checked)}
            />
            <Label htmlFor="organic" className="text-sm font-medium">
              This is an organic product
            </Label>
          </div> */}

          {/* Image Upload Placeholder */}
         <div className="space-y-2">
      <Label htmlFor="image">Product Image (Optional)</Label>

      {/* Hidden input */}
      <input
        id="image"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload area */}
      <label
        htmlFor="image"
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer flex flex-col items-center justify-center"
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded preview"
            className="max-h-32 object-contain mb-2"
          />
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 10MB
            </p>
          </>
        )}
      </label>
    </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-hero"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                mode === 'add' ? 'Adding...' : 'Updating...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {mode === 'add' ? 'Add Product' : 'Update Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}