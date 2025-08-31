import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface FarmerOffer {
  _id: string;
  productName: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  category: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  farmLocation: string;
  contactPhone: string;
  contactEmail: string;
  harvestDate: string;
  expiryDate: string;
  deliveryOptions: string[];
  isOrganic: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  adminResponse?: string;
  responseDate?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmerOfferData {
  productName: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  category: string;
  farmLocation: string;
  contactPhone: string;
  contactEmail: string;
  harvestDate: string;
  expiryDate: string;
  deliveryOptions: string[];
  isOrganic: boolean;
  images?: string[];
}

export interface AdminResponseData {
  status: 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  adminResponse?: string;
}

// Hook for farmers to get their own offers
export const useFarmerOffers = () => {
  return useQuery({
    queryKey: ['farmer-offers'],
    queryFn: async () => {
      const response = await apiService.getFarmerOffers();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as FarmerOffer[];
    },
  });
};

// Hook for admins to get all offers
export const useAllFarmerOffers = (params?: { status?: string; category?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['all-farmer-offers', params],
    queryFn: async () => {
      const response = await apiService.getAllFarmerOffers(params);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as { data: FarmerOffer[]; pagination: any };
    },
  });
};

// Hook for creating farmer offers
export const useCreateFarmerOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (offerData: CreateFarmerOfferData) => {
      const response = await apiService.createFarmerOffer(offerData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as FarmerOffer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-offers'] });
      queryClient.invalidateQueries({ queryKey: ['all-farmer-offers'] });
      toast({
        title: "Offer Created",
        description: "Your offer has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create offer. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for updating farmer offers
export const useUpdateFarmerOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, offerData }: { id: string; offerData: Partial<CreateFarmerOfferData> }) => {
      const response = await apiService.updateFarmerOffer(id, offerData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as FarmerOffer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-offers'] });
      queryClient.invalidateQueries({ queryKey: ['all-farmer-offers'] });
      toast({
        title: "Offer Updated",
        description: "Your offer has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update offer. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting farmer offers
export const useDeleteFarmerOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteFarmerOffer(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-offers'] });
      queryClient.invalidateQueries({ queryKey: ['all-farmer-offers'] });
      toast({
        title: "Offer Deleted",
        description: "Your offer has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for admin to respond to offers
export const useAdminRespondToOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, responseData }: { id: string; responseData: AdminResponseData }) => {
      const response = await apiService.adminRespondToOffer(id, responseData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as FarmerOffer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-farmer-offers'] });
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the farmer.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send response. Please try again.",
        variant: "destructive",
      });
    },
  });
}; 