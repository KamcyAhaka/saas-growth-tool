
import React from "react";
import {
  calculateActiveUsers,
  calculateMRR,
  calculateLTVCAC,
  calculateChurnImpact,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDecimal,
} from "@/utils/calculationUtils";
import { CalculatorValues } from "./Calculator";
import MetricCard from "./MetricCard";
import GrowthChart from "./GrowthChart";
import { Users, DollarSign, TrendingUp, UserMinus, Wallet, LineChart } from "lucide-react";

interface CalculatorResultsProps {
  values: CalculatorValues;
}

const CalculatorResults = ({ values }: CalculatorResultsProps) => {
  // Calculate metrics
  const monthsToProject = 18; // 18 months for longer-term projections
  
  const activeUsers = calculateActiveUsers(
    values.monthlyVisitors,
    values.signupRate,
    values.activationRate,
    values.retentionRate,
    monthsToProject
  );
  
  const monthlyMRR = calculateMRR(activeUsers, values.mrr);
  const ltvCacRatio = calculateLTVCAC(values.ltv, values.cac);
  const churnImpact = calculateChurnImpact(activeUsers, values.churnRate);
  
  // Prepare data for charts
  const monthLabels = Array.from({ length: monthsToProject }, (_, i) => 
    `M${i + 1}`
  );
  
  const userChartData = monthLabels.map((month, i) => ({
    name: month,
    "Active Users": Math.round(activeUsers[i]),
    "Churned Users": Math.round(churnImpact[i]),
  }));
  
  const revenueChartData = monthLabels.map((month, i) => ({
    name: month,
    "Monthly Revenue": Math.round(monthlyMRR[i]),
  }));
  
  const cumulativeRevenueData = monthLabels.map((month, i) => {
    // Sum up revenue up to this month
    const totalRevenue = monthlyMRR.slice(0, i + 1).reduce((sum, mrr) => sum + mrr, 0);
    const totalCAC = Math.round(activeUsers[i] * values.cac);
    
    return {
      name: month,
      "Cumulative Revenue": Math.round(totalRevenue),
      "Cumulative CAC": totalCAC,
    };
  });
  
  // Forecast for specific periods
  const revenue3Month = monthlyMRR[2]; // 3rd month (index 2)
  const revenue6Month = monthlyMRR[5]; // 6th month (index 5)
  const revenue12Month = monthlyMRR[11]; // 12th month (index 11)
  
  // Calculate growth rates
  const calculateGrowthRate = (current: number, previous: number) => {
    return previous === 0 ? 0 : ((current - previous) / previous) * 100;
  };
  
  const userGrowthRate3Month = calculateGrowthRate(
    activeUsers[2], 
    activeUsers[0]
  );
  
  const revenueGrowthRate3Month = calculateGrowthRate(
    monthlyMRR[2],
    monthlyMRR[0]
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Users */}
        <MetricCard
          title="Active Users (Current)"
          value={formatNumber(Math.round(activeUsers[0]))}
          icon={<Users className="h-4 w-4" />}
          description="Projected active users"
        />
        
        {/* Current MRR */}
        <MetricCard
          title="Monthly Revenue (Current)"
          value={formatCurrency(Math.round(monthlyMRR[0]))}
          icon={<DollarSign className="h-4 w-4" />}
          description="Projected monthly revenue"
        />
        
        {/* LTV:CAC Ratio */}
        <MetricCard
          title="LTV:CAC Ratio"
          value={formatDecimal(ltvCacRatio, 1)}
          icon={<TrendingUp className="h-4 w-4" />}
          description={ltvCacRatio >= 3 ? "Healthy ratio (target > 3)" : "Below target (aim for > 3)"}
          trend={ltvCacRatio >= 3 ? "up" : "down"}
          trendValue={ltvCacRatio >= 3 ? "Good" : "Needs improvement"}
        />
        
        {/* Monthly Churn Impact */}
        <MetricCard
          title="Monthly Churn Impact"
          value={formatNumber(Math.round(churnImpact[0]))}
          icon={<UserMinus className="h-4 w-4" />}
          description="Users lost per month"
          trend="down"
          trendValue={formatPercentage(values.churnRate)}
        />
      </div>

      {/* Revenue Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="3-Month Revenue"
          value={formatCurrency(Math.round(revenue3Month))}
          icon={<Wallet className="h-4 w-4" />}
          trend={revenue3Month > monthlyMRR[0] ? "up" : "down"}
          trendValue={formatPercentage(revenueGrowthRate3Month)}
        />
        
        <MetricCard
          title="6-Month Revenue"
          value={formatCurrency(Math.round(revenue6Month))}
          icon={<Wallet className="h-4 w-4" />}
          trend={revenue6Month > revenue3Month ? "up" : "down"}
          trendValue={formatPercentage(
            calculateGrowthRate(revenue6Month, revenue3Month)
          )}
        />
        
        <MetricCard
          title="12-Month Revenue"
          value={formatCurrency(Math.round(revenue12Month))}
          icon={<Wallet className="h-4 w-4" />}
          trend={revenue12Month > revenue6Month ? "up" : "down"}
          trendValue={formatPercentage(
            calculateGrowthRate(revenue12Month, revenue6Month)
          )}
        />
      </div>

      {/* User Growth Chart */}
      <GrowthChart
        title="User Growth Over Time"
        data={userChartData}
        type="area"
        dataKeys={["Active Users", "Churned Users"]}
        colors={["#4361EE", "#EF4444"]}
        yAxisFormatter={(value) => `${Math.round(value / 1000)}k`}
        tooltipFormatter={(value) => [formatNumber(value), "Users"]}
        height={300}
      />

      {/* Revenue Chart */}
      <GrowthChart
        title="Monthly Revenue Forecast"
        data={revenueChartData}
        type="bar"
        dataKeys={["Monthly Revenue"]}
        colors={["#06D6A0"]}
        yAxisFormatter={(value) => `$${Math.round(value / 1000)}k`}
        tooltipFormatter={(value) => [formatCurrency(value), "Revenue"]}
        height={300}
      />

      {/* Cumulative Revenue vs CAC */}
      <GrowthChart
        title="Cumulative Revenue vs CAC"
        data={cumulativeRevenueData}
        type="line"
        dataKeys={["Cumulative Revenue", "Cumulative CAC"]}
        colors={["#7209B7", "#EF4444"]}
        yAxisFormatter={(value) => `$${Math.round(value / 1000)}k`}
        tooltipFormatter={(value) => [formatCurrency(value), ""]}
        height={300}
      />

      {/* Additional Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg. Customer Lifetime"
          value={`${values.customerLifetime} months`}
          description="How long customers stay"
        />
        
        <MetricCard
          title="Customer Acquisition Cost"
          value={formatCurrency(values.cac)}
          description="Cost to acquire one customer"
        />
        
        <MetricCard
          title="Customer Lifetime Value"
          value={formatCurrency(values.ltv)}
          description="Revenue from one customer"
        />
        
        <MetricCard
          title="Signups Per Month"
          value={formatNumber(Math.round(values.monthlyVisitors * (values.signupRate / 100)))}
          description={`${formatPercentage(values.signupRate)} of visitors`}
        />
      </div>
    </div>
  );
};

export default CalculatorResults;
