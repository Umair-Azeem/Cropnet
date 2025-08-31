export interface AnalyticsData {
    revenue: {
      current: number;
      previous: number;
      change: number;
    };
    orders: {
      current: number;
      previous: number;
      change: number;
    };
    users: {
      current: number;
      previous: number;
      change: number;
    };
    products: {
      current: number;
      previous: number;
      change: number;
    };
    topCategories: {
      name: string;
      value: number;
      percentage: number;
    }[];
    monthlyData: {
      month: string;
      revenue: number;
      orders: number;
      users: number;
    }[];
  }
  
  export type AnalyticsChartProps = {
    data: AnalyticsData;
  };