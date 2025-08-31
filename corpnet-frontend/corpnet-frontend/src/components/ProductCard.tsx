import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/types'; // ✅ use central source of truth

import {
  ShoppingCart,
  Package,
  MapPin,
  Star,
  Edit,
  Trash2
} from 'lucide-react';

// src/types/index.ts

// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   unit: string; // ✅ should be string
//   category: string;
//   farmer: {
//     _id: string;
//     name: string;
//   }; // ✅ should be object

//   images?: string[];
//   createdAt: string;
//   updatedAt: string;

//   quantity?: number;
//   location?: string;
//   organic?: boolean;
// }


interface ProductCardProps {
  product: Product;
  userType?: 'farmer' | 'customer' | 'admin';
  isOwner?: boolean;
  onAddToCart?: (productId: string, quantity: number) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({
  product,
  userType = 'customer',
  isOwner = false,
  onAddToCart,
  onEdit,
  onDelete
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (onAddToCart && quantity > 0 && quantity <= product.quantity) {
      onAddToCart(product._id, quantity);
    }
  };

  console.log("[ProductCard.tsx] product =>", product)

  return (
    <Card className="card-elevated hover:scale-105 transition-transform duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-accent/10 to-secondary/20">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt="Uploaded preview"
            // className="max-h-32 object-contain mb-2"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>

        {/* Owner Actions */}
        {isOwner && (userType === 'farmer' || userType === 'admin') && (
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => onEdit?.(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => onDelete?.(product._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{product.farmer.name}</span>
          </div> */}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-primary">Rs. {product.price}</span>
              <span className="text-sm text-muted-foreground">/kg</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Stock: {product.quantity}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {userType === 'customer' && !isOwner ? (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor={`quantity-${product._id}`} className="text-sm">Quantity:</Label>
              <Input
                id={`quantity-${product._id}`}
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={quantity <= 0 || quantity > product.stock}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        ) : (
          <div className="w-full text-center text-sm text-muted-foreground">
            {isOwner ? 'Your product' : 'Login to purchase'}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}