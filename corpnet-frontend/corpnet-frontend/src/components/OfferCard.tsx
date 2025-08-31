import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Package, 
  Star,
  Eye,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

interface Offer {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  category: string;
  farmer: string;
  farmLocation: string;
  contactPhone: string;
  harvestDate: string;
  expiryDate: string;
  deliveryOptions: string[];
  organic: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  images?: string[];
  qualityCertificates?: string[];
}

interface OfferCardProps {
  offer: Offer;
  userType?: 'admin' | 'farmer' | 'customer';
  isOwner?: boolean;
  onApprove?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  onView?: (offer: Offer) => void;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offerId: string) => void;
}

export function OfferCard({ 
  offer, 
  userType = 'admin',
  isOwner = false,
  onApprove,
  onReject,
  onView,
  onEdit,
  onDelete
}: OfferCardProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <Calendar className="h-4 w-4 text-gray-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(offer.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <Card className="card-elevated hover:scale-105 transition-transform duration-300 overflow-hidden">
      {/* Status Bar */}
      <div className={`h-1 ${
        offer.status === 'approved' ? 'bg-green-500' : 
        offer.status === 'pending' ? 'bg-yellow-500' :
        offer.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
      }`} />

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-poppins font-semibold text-lg">
                {offer.productName}
              </h3>
              {offer.organic && (
                <Badge className="badge-organic text-xs">Organic</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {offer.quantity} units
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {offer.farmLocation}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">By: {offer.farmer}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {getStatusIcon(offer.status)}
              {getStatusBadge(offer.status)}
            </div>
            <p className="font-bold text-xl text-primary">₹{offer.pricePerUnit}</p>
            <p className="text-xs text-muted-foreground">per unit</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {offer.description}
          </p>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p><span className="font-medium">Category:</span> {offer.category}</p>
              <p><span className="font-medium">Harvest:</span> {offer.harvestDate}</p>
              <p><span className="font-medium">Total Value:</span> ₹{offer.totalValue.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p><span className="font-medium">Delivery:</span> {offer.deliveryOptions.join(', ')}</p>
              <p><span className="font-medium">Expires:</span> {offer.expiryDate}</p>
              <p><span className="font-medium">Posted:</span> {offer.createdAt}</p>
            </div>
          </div>

          {/* Warning for expiring offers */}
          {isExpiringSoon() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-800">Expires soon!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {userType === 'admin' && offer.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(offer.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject?.(offer.id)}
                  className="flex-1"
                >
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {isOwner && userType === 'farmer' && (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(offer)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(offer.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(offer)}
              className={isOwner ? 'w-auto' : 'flex-1'}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}