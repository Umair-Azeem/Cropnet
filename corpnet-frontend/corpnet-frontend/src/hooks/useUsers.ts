import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'farmer' | 'admin';
  phone?: string;
  location?: string;
  isActive: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'customer' | 'farmer' | 'admin';
  phone?: string;
  location?: string;
  isActive?: boolean;
}

// Hook for getting all users (admin only)
export const useUsers = (params?: { role?: string; status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await apiService.getAllUsers(params);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as { data: User[]; pagination: any };
    },
  });
};

// Hook for getting a single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await apiService.getUser(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as User;
    },
    enabled: !!id,
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UpdateUserData }) => {
      const response = await apiService.updateUser(id, userData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteUser(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for toggling user status
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.toggleUserStatus(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as { isActive: boolean };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Status Updated",
        description: `User has been ${data.isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    },
  });
}; 