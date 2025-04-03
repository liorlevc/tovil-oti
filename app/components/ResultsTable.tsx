'use client'

import { useState } from 'react';

interface Business {
  name: string;
  phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  hours?: string;
  placeId?: string;
  email?: string;
}

interface ResultsTableProps {
  businesses: Business[];
}

export default function ResultsTable({ businesses }: ResultsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  
  const exportToCSV = () => {
    // Prepare CSV content
    const headers = ['שם', 'טלפון', 'כתובת', 'אתר', 'דירוג', 'מספר ביקורות', 'קטגוריה', 'שעות פעילות'];
    const csvRows = [headers];
    
    // Add business data rows
    businesses.forEach(business => {
      const row = [
        business.name || '',
        business.phone || '',
        business.address || '',
        business.website || '',
        business.rating?.toString() || '',
        business.reviewCount?.toString() || '',
        business.category || '',
        business.hours || ''
      ];
      // Escape any commas in the data
      const escapedRow = row.map(cell => `"${cell.replace(/"/g, '""')}"`);
      csvRows.push(escapedRow);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'חברות_הובלה.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToJSON = () => {
    // Extract only the fields requested by the user
    const simplifiedData = businesses.map(business => ({
      name: business.name || '',
      phone: business.phone || '',
      area: business.address || '', // Using address as the "area" field
      rating: business.rating || '',
      email: business.email || '', // Use the email field directly from the business object
    }));
    
    // Create a blob with the JSON data
    const jsonContent = JSON.stringify(simplifiedData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'חברות_הובלה.json');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Desktop table view
  const renderDesktopTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            שם
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            טלפון
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            כתובת
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            אתר
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            דירוג
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            קטגוריה
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            שעות פעילות
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {businesses.map((business, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              {business.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {business.phone || 'אין מידע'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {business.address || 'אין מידע'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {business.website ? (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  כניסה לאתר
                </a>
              ) : 'אין מידע'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {business.rating ? `${business.rating} (${business.reviewCount} ביקורות)` : 'אין מידע'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {business.category || 'אין מידע'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {business.hours || 'אין מידע'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
  // Mobile card view
  const renderMobileView = () => (
    <div className="grid gap-4">
      {businesses.map((business, index) => (
        <div key={index} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleRow(index)}
          >
            <div className="font-medium text-right">{business.name}</div>
            <div className="text-blue-600">
              {expandedRow === index ? "▲" : "▼"}
            </div>
          </div>
          
          {expandedRow === index && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-500">טלפון:</div>
                <div className="text-right font-medium">
                  {business.phone ? (
                    <a href={`tel:${business.phone}`} className="text-blue-600">
                      {business.phone}
                    </a>
                  ) : 'אין מידע'}
                </div>
                
                <div className="text-gray-500">כתובת:</div>
                <div className="text-right">{business.address || 'אין מידע'}</div>
                
                <div className="text-gray-500">אתר:</div>
                <div className="text-right">
                  {business.website ? (
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                      כניסה לאתר
                    </a>
                  ) : 'אין מידע'}
                </div>
                
                <div className="text-gray-500">דירוג:</div>
                <div className="text-right">
                  {business.rating ? `${business.rating} (${business.reviewCount} ביקורות)` : 'אין מידע'}
                </div>
                
                <div className="text-gray-500">קטגוריה:</div>
                <div className="text-right">{business.category || 'אין מידע'}</div>
                
                <div className="text-gray-500">שעות פעילות:</div>
                <div className="text-right">{business.hours || 'אין מידע'}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2 rtl:space-x-reverse">
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            ייצוא ל-CSV
          </button>
          <button 
            onClick={exportToJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ייצוא ל-JSON
          </button>
        </div>
        <h2 className="text-xl font-semibold">תוצאות ({businesses.length})</h2>
      </div>
      
      {/* Desktop view (hidden on small screens) */}
      <div className="hidden md:block">
        {renderDesktopTable()}
      </div>
      
      {/* Mobile view (visible only on small screens) */}
      <div className="md:hidden">
        {renderMobileView()}
      </div>
    </div>
  );
} 