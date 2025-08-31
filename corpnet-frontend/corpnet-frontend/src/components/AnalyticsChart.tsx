import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';
import { AnalyticsData } from '@/types';

interface AnalyticsChartProps {
  data: AnalyticsData;
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(data.revenue.current)}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(data.revenue.change)}`}>
                  {getChangeIcon(data.revenue.change)}
                  <span>{Math.abs(data.revenue.change)}% from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{data.orders.current}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(data.orders.change)}`}>
                  {getChangeIcon(data.orders.change)}
                  <span>{Math.abs(data.orders.change)}% from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{data.users.current}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(data.users.change)}`}>
                  {getChangeIcon(data.users.change)}
                  <span>{Math.abs(data.users.change)}% from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products Listed</p>
                <p className="text-2xl font-bold">{data.products.current}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(data.products.change)}`}>
                  {getChangeIcon(data.products.change)}
                  <span>{Math.abs(data.products.change)}% from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Charts Row */}
      <div className="grid ">
        {/* Revenue Chart */}
        {/* <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Revenue Chart</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Last 6 months: {data.monthlyData.map(d => formatCurrency(d.revenue)).join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Top Categories */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Product Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' :
                      index === 1 ? 'bg-accent' :
                        index === 2 ? 'bg-secondary' : 'bg-muted'
                      }`} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{category.value}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      {/* <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Month</th>
                  <th className="text-right py-3 font-medium">Revenue</th>
                  <th className="text-right py-3 font-medium">Orders</th>
                  <th className="text-right py-3 font-medium">New Users</th>
                  <th className="text-right py-3 font-medium">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyData.map((month) => (
                  <tr key={month.month} className="border-b last:border-b-0">
                    <td className="py-3 font-medium">{month.month}</td>
                    <td className="py-3 text-right">{formatCurrency(month.revenue)}</td>
                    <td className="py-3 text-right">{month.orders}</td>
                    <td className="py-3 text-right">{month.users}</td>
                    <td className="py-3 text-right">
                      {formatCurrency(month.orders > 0 ? month.revenue / month.orders : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}