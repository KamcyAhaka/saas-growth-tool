
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CalculatorValues } from '@/components/Calculator';
import { 
  calculateActiveUsers, 
  calculateMRR, 
  calculateLTVCAC, 
  calculateChurnImpact,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDecimal
} from './calculationUtils';

export const exportToCSV = (values: CalculatorValues) => {
  // Calculate metrics
  const monthsToProject = 18;
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
  
  // Revenue forecasts
  const revenue3Month = monthlyMRR[2];
  const revenue6Month = monthlyMRR[5];
  const revenue12Month = monthlyMRR[11];
  
  // Prepare CSV data
  const csvData = [
    ['Metric', 'Value'],
    ['Active Users (Current)', formatNumber(Math.round(activeUsers[0]))],
    ['Monthly Revenue (Current)', formatCurrency(Math.round(monthlyMRR[0]))],
    ['LTV:CAC Ratio', formatDecimal(ltvCacRatio, 1)],
    ['Monthly Churn Impact', formatNumber(Math.round(churnImpact[0]))],
    ['3-Month Revenue', formatCurrency(Math.round(revenue3Month))],
    ['6-Month Revenue', formatCurrency(Math.round(revenue6Month))],
    ['12-Month Revenue', formatCurrency(Math.round(revenue12Month))],
    ['Customer Lifetime', `${values.customerLifetime} months`],
    ['Customer Acquisition Cost', formatCurrency(values.cac)],
    ['Customer Lifetime Value', formatCurrency(values.ltv)],
    ['Signups Per Month', formatNumber(Math.round(values.monthlyVisitors * (values.signupRate / 100)))],
    ['Monthly Visitors', formatNumber(values.monthlyVisitors)],
    ['Signup Rate', formatPercentage(values.signupRate)],
    ['Activation Rate', formatPercentage(values.activationRate)],
    ['Retention Rate', formatPercentage(values.retentionRate)],
    ['Churn Rate', formatPercentage(values.churnRate)],
    ['Monthly Revenue per User', formatCurrency(values.mrr)],
    [''],
    ['Monthly Projections'],
    ['Month', 'Active Users', 'Monthly Revenue', 'Churned Users'],
    ...Array.from({ length: monthsToProject }, (_, i) => [
      `M${i + 1}`,
      Math.round(activeUsers[i]).toString(),
      Math.round(monthlyMRR[i]).toString(),
      Math.round(churnImpact[i]).toString()
    ])
  ];
  
  // Convert to CSV string
  const csvContent = csvData.map(row => row.join(',')).join('\n');
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `saas-growth-projections-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async () => {
  const resultsSection = document.getElementById('results-section');
  if (!resultsSection) {
    console.error('Results section not found');
    return;
  }

  try {
    // Create a clone of the results section to avoid modifying the original
    const clonedSection = resultsSection.cloneNode(true) as HTMLElement;
    
    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = 'SaaS Growth Projections';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    
    // Add generation date
    const dateDiv = document.createElement('div');
    dateDiv.textContent = `Generated on: ${new Date().toLocaleDateString()}`;
    dateDiv.style.textAlign = 'center';
    dateDiv.style.marginBottom = '30px';
    dateDiv.style.fontSize = '12px';
    dateDiv.style.color = '#666';
    
    tempContainer.appendChild(title);
    tempContainer.appendChild(dateDiv);
    tempContainer.appendChild(clonedSection);
    
    document.body.appendChild(tempContainer);
    
    // Generate canvas from the temp container
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Remove temp container
    document.body.removeChild(tempContainer);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download PDF
    pdf.save(`saas-growth-projections-${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
