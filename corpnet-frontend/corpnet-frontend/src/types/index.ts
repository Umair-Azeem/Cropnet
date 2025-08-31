// Analytics types
export interface AnalyticsMetric {
    current: number;
    previous: number;
    change: number;
  }
  
  export interface CategoryData {
    name: string;
    value: number;
    percentage: number;
  }
  
  export interface MonthlyData {
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }
  
  export interface AnalyticsData {
    revenue: AnalyticsMetric;
    orders: AnalyticsMetric;
    users: AnalyticsMetric;
    products: AnalyticsMetric;
    topCategories: CategoryData[];
    monthlyData: MonthlyData[];
  }
  
  // Product types
 // src/types/index.ts

 export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    unit: string;
    category: string;
    location?: string;
    organic?: boolean;
   farmer:{
    _id: string;
    name: string;
   }
    images?: string[];
    createdAt: string;
    updatedAt: string;
    quantity?: number; // ✅ optional
  }
  
  
// User types
export interface User {
    _id?: string;             // MongoDB document ID
    name: string;
    email: string;
    password?: string;        // Optional if you’re not sending it from backend
    role: 'admin' | 'farmer' | 'customer';
    address?: string;
    phone?: string;
    avatar?: string;          // Profile image URL or path
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isVerified?: boolean;
  }
  


  export type ProductFormMode = 'add' | 'edit';
  export type CreateProductData = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;

