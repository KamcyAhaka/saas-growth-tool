

import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { type CalculatorValues } from './Calculator';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils.ts';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonsProps {
  values: CalculatorValues;
}

const ExportButtons = ({ values }: ExportButtonsProps) => {
  const { toast } = useToast();

  const handleCSVExport = () => {
    try {
      exportToCSV(values);
      toast({
        title: "CSV Export Successful",
        description: "Your SaaS projections have been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting to CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePDFExport = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your PDF report...",
      });
      
      await exportToPDF();
      
      toast({
        title: "PDF Export Successful",
        description: "Your SaaS projections report has been exported to PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting to PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <Button
        onClick={handleCSVExport}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export to CSV
      </Button>
      
      <Button
        onClick={handlePDFExport}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export to PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
