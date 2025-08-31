import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateFarmerOffer, CreateFarmerOfferData } from '@/hooks/useFarmerOffers';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
  Leaf
} from 'lucide-react';
import axios from 'axios';

interface FarmerOfferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FarmerOfferForm({ onSuccess, onCancel }: FarmerOfferFormProps) {
  const { user } = useAuth();
  const createOffer = useCreateFarmerOffer();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    quantity: 0,
    price: 0,
    contactPhone: '',
  });

  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<string[]>([]);

  const handleChange = (field: keyof CreateFarmerOfferData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeliveryOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedDeliveryOptions(prev => [...prev, option]);
    } else {
      setSelectedDeliveryOptions(prev => prev.filter(o => o !== option));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const offerData = {
    //   ...formData,
    //   deliveryOptions: selectedDeliveryOptions
    // };

    // try {
    //   // await createOffer.mutateAsync(offerData);
    //   onSuccess?.();
    // } catch (error) {
    //   // Error is handled by the mutation
    // }

    // console.log("[FarmerOfferForm.tsx] api/farmer-offers =>", formData);
    const farmerOfferPostBody = {
      name: formData.productName,
      description: formData.description,
      quantity: formData.quantity,
      contact: formData.contactPhone,
      price: formData.price,
      status: 'pending',
      createdBy: user.email
    };
    console.log("[FarmerOfferForm.tsx] farmerOfferPostBody =>", farmerOfferPostBody);

    try {
      const response = await axios.post("http://localhost:5000/api/farmer-offers", farmerOfferPostBody);
      console.log("[AdminPanel.tsx] api/farmer-offers -> response.data=>", response.data);
      if (!response.data.data) {
        // farmerOfferSubmitted(false)
        onSuccess();
      }
    } catch (e) {
      console.log("[AdminPanel.tsx] api/users -> error=>", e)
    }

  };


  const categories = [
    'Vegetables', 'Fruits'
  ];

  const deliveryOptions = [
    'Farm Pickup',
    'Local Delivery',
    'Transportation Provided',
    'Self Pickup'
  ];




  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Submit Offer to Admin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleChange('productName', e.target.value)}
                  placeholder="e.g., Organic Tomatoes"
                  required
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
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
              </div> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your product, quality, special features..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity per kg*</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', Number(e.target.value))}
                  placeholder="500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  //ignore below error its type ...can be ignored!
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  placeholder="35.00"
                  required
                />
              </div>

              {/* <div className="space-y-2">
                <Label>Total Value</Label>
                <div className="p-2 bg-muted rounded-md text-center font-semibold">
                  ₹{(formData.quantity * formData.pricePerUnit).toLocaleString()}
                </div>
              </div> */}
            </div>

            {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="isOrganic"
                checked={formData.isOrganic}
                onCheckedChange={(checked) => handleChange('isOrganic', checked)}
              />
              <Label htmlFor="isOrganic" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Organic Product
              </Label>
            </div> */}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <Label htmlFor="farmLocation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Farm Location *
                </Label>
                <Input
                  id="farmLocation"
                  value={formData.farmLocation}
                  onChange={(e) => handleChange('farmLocation', e.target.value)}
                  placeholder="City, State"
                  required
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Phone *
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Email *
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="farmer@example.com"
                required
              />
            </div> */}
          </div>

          {/* Dates */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold text-lg">Important Dates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harvestDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Harvest Date *
                </Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleChange('harvestDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expiry Date *
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div> */}

          {/* Delivery Options */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Options *
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={selectedDeliveryOptions.includes(option)}
                    onCheckedChange={(checked) => handleDeliveryOptionChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createOffer.isPending}
            >
              {createOffer.isPending ? "Submitting..." : "Submit Offer"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createOffer.isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 