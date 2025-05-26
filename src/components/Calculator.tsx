
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalculatorProps {
  onCalculate: (values: CalculatorValues) => void;
}

export interface CalculatorValues {
  monthlyVisitors: number;
  signupRate: number;
  activationRate: number;
  retentionRate: number;
  churnRate: number;
  customerLifetime: number;
  mrr: number;
  cac: number;
  ltv: number;
}

const Calculator = ({ onCalculate }: CalculatorProps) => {
  const [values, setValues] = useState<CalculatorValues>({
    monthlyVisitors: 10000,
    signupRate: 3,
    activationRate: 60,
    retentionRate: 90,
    churnRate: 10,
    customerLifetime: 10,
    mrr: 50,
    cac: 200,
    ltv: 500,
  });

  // Update customer lifetime when churn rate changes
  useEffect(() => {
    if (values.churnRate > 0) {
      const lifetime = Math.round(1 / (values.churnRate / 100));
      setValues((prev) => ({ ...prev, customerLifetime: lifetime }));
    }
  }, [values.churnRate]);

  // Update churn rate when retention rate changes
  useEffect(() => {
    const churn = 100 - values.retentionRate;
    setValues((prev) => ({ ...prev, churnRate: churn }));
  }, [values.retentionRate]);

  // Calculate LTV when MRR or customer lifetime changes
  useEffect(() => {
    const ltv = values.mrr * values.customerLifetime;
    setValues((prev) => ({ ...prev, ltv }));
  }, [values.mrr, values.customerLifetime]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CalculatorValues
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSliderChange = (value: number[], field: keyof CalculatorValues) => {
    setValues((prev) => ({ ...prev, [field]: value[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input values
    if (values.monthlyVisitors <= 0) {
      toast.error("Monthly visitors must be greater than 0");
      return;
    }
    
    if (values.signupRate <= 0 || values.signupRate > 100) {
      toast.error("Signup rate must be between 0 and 100%");
      return;
    }
    
    if (values.mrr <= 0) {
      toast.error("MRR must be greater than 0");
      return;
    }
    
    if (values.cac <= 0) {
      toast.error("CAC must be greater than 0");
      return;
    }
    
    onCalculate(values);
    toast.success("Calculator updated!");
  };

  const renderTooltip = (content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-auto rounded-full"
            onClick={(e) => e.preventDefault()}
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">SaaS Growth Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monthly Visitors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthlyVisitors" className="text-sm font-medium">
                Monthly Visitors
              </Label>
              {renderTooltip(
                "The average number of unique visitors to your website per month."
              )}
            </div>
            <Input
              id="monthlyVisitors"
              type="number"
              className="calculator-input"
              value={values.monthlyVisitors}
              onChange={(e) => handleInputChange(e, "monthlyVisitors")}
            />
          </div>

          {/* Signup Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="signupRate" className="text-sm font-medium">
                Signup Conversion Rate (%)
              </Label>
              {renderTooltip(
                "The percentage of website visitors who sign up for your product."
              )}
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="signupRate"
                min={0}
                max={20}
                step={0.1}
                value={[values.signupRate]}
                onValueChange={(value) => handleSliderChange(value, "signupRate")}
                className="flex-1"
              />
              <Input
                type="number"
                value={values.signupRate}
                onChange={(e) => handleInputChange(e, "signupRate")}
                className="w-20"
              />
            </div>
          </div>

          {/* Activation Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="activationRate" className="text-sm font-medium">
                Activation Rate (%)
              </Label>
              {renderTooltip(
                "The percentage of users who complete your activation milestone and become active users."
              )}
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="activationRate"
                min={0}
                max={100}
                step={1}
                value={[values.activationRate]}
                onValueChange={(value) => handleSliderChange(value, "activationRate")}
                className="flex-1"
              />
              <Input
                type="number"
                value={values.activationRate}
                onChange={(e) => handleInputChange(e, "activationRate")}
                className="w-20"
              />
            </div>
          </div>

          {/* Retention Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="retentionRate" className="text-sm font-medium">
                Monthly Retention Rate (%)
              </Label>
              {renderTooltip(
                "The percentage of users who continue using your product each month."
              )}
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="retentionRate"
                min={0}
                max={100}
                step={1}
                value={[values.retentionRate]}
                onValueChange={(value) => handleSliderChange(value, "retentionRate")}
                className="flex-1"
              />
              <Input
                type="number"
                value={values.retentionRate}
                onChange={(e) => handleInputChange(e, "retentionRate")}
                className="w-20"
              />
            </div>
          </div>

          {/* Monthly Churn Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="churnRate" className="text-sm font-medium">
                Monthly Churn Rate (%)
              </Label>
              {renderTooltip(
                "The percentage of customers who cancel their subscription each month. This is automatically calculated as 100% - Retention Rate."
              )}
            </div>
            <Input
              id="churnRate"
              type="number"
              className="calculator-input"
              value={values.churnRate}
              disabled
            />
          </div>

          {/* Customer Lifetime */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="customerLifetime" className="text-sm font-medium">
                Customer Lifetime (months)
              </Label>
              {renderTooltip(
                "The average number of months a customer stays subscribed. This is automatically calculated as 1 / Churn Rate."
              )}
            </div>
            <Input
              id="customerLifetime"
              type="number"
              className="calculator-input"
              value={values.customerLifetime}
              disabled
            />
          </div>

          {/* MRR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mrr" className="text-sm font-medium">
                Monthly Recurring Revenue ($ per user)
              </Label>
              {renderTooltip(
                "The average revenue generated by each customer per month."
              )}
            </div>
            <Input
              id="mrr"
              type="number"
              className="calculator-input"
              value={values.mrr}
              onChange={(e) => handleInputChange(e, "mrr")}
            />
          </div>

          {/* CAC */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cac" className="text-sm font-medium">
                Customer Acquisition Cost ($)
              </Label>
              {renderTooltip(
                "The average cost to acquire a new customer."
              )}
            </div>
            <Input
              id="cac"
              type="number"
              className="calculator-input"
              value={values.cac}
              onChange={(e) => handleInputChange(e, "cac")}
            />
          </div>

          {/* LTV */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ltv" className="text-sm font-medium">
                Customer Lifetime Value ($)
              </Label>
              {renderTooltip(
                "The total revenue expected from a customer during their lifetime. This is automatically calculated as MRR × Customer Lifetime."
              )}
            </div>
            <Input
              id="ltv"
              type="number"
              className="calculator-input"
              value={values.ltv}
              disabled
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-saas-blue hover:bg-saas-darkBlue text-white"
          >
            Calculate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Calculator;
