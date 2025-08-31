import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminRespondToOffer } from '@/hooks/useFarmerOffers';
// import { FarmerOffer } from '@/hooks/useFarmerOffers';
import {
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
  Leaf,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';

interface FarmerOffer {
  _id: string;
  contact: string;
  createdAt: string;
  description: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  updatedAT: string;
  __v: number;
}

interface FarmerOfferCardProps {
  offer: FarmerOffer;
  userType: 'farmer' | 'admin';
  onUpdate?: () => void;
}

export function FarmerOfferCard({ offer, userType, onUpdate }: FarmerOfferCardProps) {
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseData, setResponseData] = useState({
    status: 'approved' as 'approved' | 'rejected' | 'completed',
    adminNotes: '',
    adminResponse: ''
  });

  const adminRespond = useAdminRespondToOffer();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleAdminResponse = async () => {

    console.log("status change api data=>",
      {
        id: offer._id,
        status: responseData.status
      })




    try {
      const res = await axios.put(`http://localhost:5000/api/farmer-offers/${offer._id}/${responseData.status}`);

      console.log("Status updated successfully:", res.data);
      setIsResponseDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating status:", error);
    }

    // try {
    //   await adminRespond.mutateAsync({
    //     id: offer._id,
    //     responseData
    //   });
    //   setIsResponseDialogOpen(false);
    //   onUpdate?.();
    // } catch (error) {
    //   // Error is handled by the mutation
    // }
  };

  return (
    <Card className="card-elevated hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              {offer.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(offer.status)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Details */}
        <div>
          <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Quantity:</span>
              <p>{offer.quantity.toLocaleString()}</p>
            </div>
            <div>
              <span className="font-medium">Total Value:</span>
              <p className="text-primary font-semibold">Rs. {offer.price}</p>
            </div>
            <div>
              <span className="font-medium">Created:</span>
              <p>{new Date(offer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Farmer Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {/* <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{offer.farmLocation}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{offer.contact}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{offer.contactEmail}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {/*ignore below error it doesn't exist*/}
              <span>{offer.createdBy}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Harvest:</span> {new Date(offer.harvestDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Expiry:</span> {new Date(offer.expiryDate).toLocaleDateString()}
            </div>
          </div>
        </div> */}

        {/* Delivery Options */}
        {/* <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery Options
          </h4>
          <div className="flex flex-wrap gap-2">
            {offer.deliveryOptions.map((option) => (
              <Badge key={option} variant="outline" className="text-xs">
                {option}
              </Badge>
            ))}
          </div>
        </div> */}

        {/* Admin Response (if exists) */}
        {/* {offer.adminResponse && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
              <MessageSquare className="h-4 w-4" />
              Admin Response
            </h4>
            <p className="text-sm text-blue-700 mb-2">{offer.adminResponse}</p>
            {offer.adminNotes && (
              <p className="text-xs text-blue-600 italic">Notes: {offer.adminNotes}</p>
            )}
            <p className="text-xs text-blue-600 mt-2">
              Responded on: {new Date(offer.responseDate!).toLocaleDateString()}
            </p>
          </div>
        )} */}

        {/* Action Buttons */}
        {userType === 'admin' && offer.status === 'pending' && (
          <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Respond to Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Respond to Farmer Offer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={responseData.status}
                    onValueChange={(value: 'approved' | 'rejected' | 'completed') =>
                      setResponseData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                      {/* <SelectItem value="completed">Completed</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                {/* <div>
                  <Label htmlFor="adminResponse">Response Message</Label>
                  <Textarea
                    id="adminResponse"
                    value={responseData.adminResponse}
                    onChange={(e) => setResponseData(prev => ({ ...prev, adminResponse: e.target.value }))}
                    placeholder="Your response to the farmer..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="adminNotes">Notes (Optional)</Label>
                  <Textarea
                    id="adminNotes"
                    value={responseData.adminNotes}
                    onChange={(e) => setResponseData(prev => ({ ...prev, adminNotes: e.target.value }))}
                    placeholder="Internal notes..."
                    rows={2}
                  />
                </div> */}

                <div className="flex gap-2">
                  <Button
                    onClick={handleAdminResponse}
                    disabled={adminRespond.isPending}
                    className="flex-1"
                  >
                    {adminRespond.isPending ? "Sending..." : "Send Response"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsResponseDialogOpen(false)}
                    disabled={adminRespond.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {userType === 'farmer' && offer.status !== 'pending' && (
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {offer.status === 'approved' ? 'Your offer has been approved!' :
                offer.status === 'rejected' ? 'Your offer was not accepted.' :
                  'Your offer has been completed.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 