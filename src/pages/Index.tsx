
import { useState } from "react";
import Calculator, { type CalculatorValues } from "@/components/Calculator";
import CalculatorResults from "@/components/CalculatorResults";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [calculatedValues, setCalculatedValues] = useState<CalculatorValues | null>(null);

  const handleCalculate = (values: CalculatorValues) => {
    setCalculatedValues(values);
    
    // Scroll to results section
    const resultsSection = document.getElementById("results-section");
    if (resultsSection) {
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-16">
      <header className="container py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-saas-gradient mb-2">
          SaaS Growth Wizard
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Plan your SaaS growth trajectory with our interactive calculator. Input your key metrics and visualize your business's potential growth over time.
        </p>
      </header>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Calculator onCalculate={handleCalculate} />
          </div>
          
          <div className="lg:col-span-2" id="results-section">
            {calculatedValues ? (
              <CalculatorResults values={calculatedValues} />
            ) : (
              <div className="h-full flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="text-center text-gray-500">
                  <h2 className="text-xl font-medium mb-2">Enter your metrics</h2>
                  <p>Fill out the calculator form and click "Calculate" to see your SaaS growth projections.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="container mt-16 text-center text-sm text-gray-500">
        <Separator className="mb-4" />
        <p>SaaS Growth Wizard — Your companion for SaaS business planning and forecasting</p>
      </footer>
    </div>
  );
};

export default Index;
