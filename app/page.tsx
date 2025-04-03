'use client'

import { useState } from 'react'
import SearchForm from './components/SearchForm'
import ResultsTable from './components/ResultsTable'
import Header from './components/Header'

type BusinessInfo = {
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

type SearchData = {
  keyword: string;
  country: string;
}

export default function Home() {
  const [results, setResults] = useState<BusinessInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSubmit = async (searchData: SearchData) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to extract data');
      }
      
      setResults(data.businesses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 min-h-screen">
      <Header />
      <SearchForm onSubmit={handleSubmit} isLoading={loading} />
      
      {loading && (
        <div className="mt-8 text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" role="status">
            <span className="sr-only">טוען...</span>
          </div>
          <p className="mt-2 text-gray-600">מחפש נתונים...</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {searchPerformed && !loading && !error && results.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
          לא נמצאו תוצאות לחיפוש שלך. נסה מילות חיפוש אחרות.
        </div>
      )}
      
      {results.length > 0 && !loading && (
        <div className="mt-8">
          <ResultsTable businesses={results} />
        </div>
      )}
      
      <footer className="mt-10 py-4 text-center text-sm text-gray-500">
        <p>© תוביל אותי - מערכת חיפוש מובילים {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
} 