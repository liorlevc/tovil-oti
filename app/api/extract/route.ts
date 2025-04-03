import { NextResponse } from 'next/server';
import { getJson } from 'serpapi';

// Define a type for SerpAPI parameters
interface SerpApiParams {
  engine: string;
  q: string;
  type: string;
  api_key: string;
  hl: string;
  gl?: string; // Google country code
  num?: string; // Number of results to return
  start?: string; // Pagination start
  [key: string]: string | undefined; // Allow other parameters
}

// Improved utility to extract place ID from Google Maps URL
function extractPlaceId(url: string): string | null {
  // Try to extract CID (client ID) parameter which uniquely identifies a place
  const cidMatch = url.match(/[?&]cid=([^&]+)/);
  if (cidMatch && cidMatch[1]) {
    return cidMatch[1];
  }
  
  // Try to extract from the data part which contains place IDs
  const dataMatch = url.match(/!1s([^!]+)!/);
  if (dataMatch && dataMatch[1]) {
    return dataMatch[1].replace('0x', '');
  }
  
  // Try to extract from path
  const placePathMatch = url.match(/place\/([^\/]+)/);
  if (placePathMatch && placePathMatch[1]) {
    return placePathMatch[1];
  }
  
  // Extract coordinates if available
  const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordsMatch) {
    return `${coordsMatch[1]},${coordsMatch[2]}`;
  }
  
  return null;
}

export async function POST(request: Request) {
  try {
    const { keyword, country } = await request.json();
    
    if (!keyword) {
      return NextResponse.json({ error: 'יש להזין מילות חיפוש' }, { status: 400 });
    }
    
    console.log('Processing search:', { keyword, country: 'il' });
    
    // Use SerpAPI to get business data
    const apiKey = process.env.SERPAPI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    // Prepare search parameters - always use Israel
    const searchParams: SerpApiParams = {
      engine: 'google_maps',
      q: keyword,
      type: 'search',
      api_key: apiKey,
      hl: 'en', // Changed from 'he' to 'en' as SerpAPI doesn't support Hebrew
      gl: 'il', // Israel
      num: '100' // Request maximum number of results
    };
    
    console.log('Search parameters:', searchParams);
    
    try {
      // Get the initial results
      const searchResponse = await getJson(searchParams);
      console.log('Search response received');
      
      if (!searchResponse.local_results || searchResponse.local_results.length === 0) {
        console.log('No local results found');
        return NextResponse.json({ 
          error: 'לא נמצאו תוצאות לחיפוש שלך', 
          debug: { searchParams } 
        }, { status: 404 });
      }
      
      // Process search results
      let businesses = searchResponse.local_results.map((result: any) => {
        // Try to extract email from various sources
        let email = '';
        
        // Check if there's a description that might contain an email
        if (result.description) {
          const emailMatch = result.description.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) {
            email = emailMatch[0];
          }
        }
        
        // If no email found and website exists, check if the website contains a mailto link
        if (!email && result.website && result.website.includes('mailto:')) {
          const emailMatch = result.website.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch && emailMatch[1]) {
            email = emailMatch[1];
          }
        }
        
        return {
          name: result.title,
          address: result.address,
          phone: result.phone,
          website: result.website,
          rating: result.rating,
          reviewCount: result.reviews,
          category: result.categories?.[0],
          hours: result.hours,
          placeId: result.place_id,
          email: email // Add the extracted email to the business object
        };
      });
      
      // Try to get additional pages of results if available
      if (searchResponse.serpapi_pagination && searchResponse.serpapi_pagination.next) {
        console.log('Fetching additional pages of results');
        
        // We'll limit to 3 additional pages to avoid rate limiting
        for (let page = 2; page <= 4; page++) {
          try {
            // Update start parameter for pagination
            const nextPageParams = { ...searchParams, start: (20 * (page - 1)).toString() };
            console.log(`Fetching page ${page}:`, nextPageParams);
            
            const nextPageResponse = await getJson(nextPageParams);
            
            if (nextPageResponse.local_results && nextPageResponse.local_results.length > 0) {
              // Add results from this page
              const moreBusinesses = nextPageResponse.local_results.map((result: any) => {
                // Try to extract email from various sources
                let email = '';
                
                // Check if there's a description that might contain an email
                if (result.description) {
                  const emailMatch = result.description.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                  if (emailMatch) {
                    email = emailMatch[0];
                  }
                }
                
                // If no email found and website exists, check if the website contains a mailto link
                if (!email && result.website && result.website.includes('mailto:')) {
                  const emailMatch = result.website.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                  if (emailMatch && emailMatch[1]) {
                    email = emailMatch[1];
                  }
                }
                
                return {
                  name: result.title,
                  address: result.address,
                  phone: result.phone,
                  website: result.website,
                  rating: result.rating,
                  reviewCount: result.reviews,
                  category: result.categories?.[0],
                  hours: result.hours,
                  placeId: result.place_id,
                  email: email // Add the extracted email to the business object
                };
              });
              
              businesses = [...businesses, ...moreBusinesses];
              console.log(`Added ${moreBusinesses.length} more businesses from page ${page}`);
              
              // If there's no next page, break the loop
              if (!nextPageResponse.serpapi_pagination || !nextPageResponse.serpapi_pagination.next) {
                break;
              }
            } else {
              // No more results
              break;
            }
          } catch (pageError) {
            console.error(`Error fetching page ${page}:`, pageError);
            break; // Stop if we encounter an error on additional pages
          }
        }
      }
      
      console.log(`Returning ${businesses.length} total businesses`);
      return NextResponse.json({ businesses });
      
    } catch (error: any) {
      console.error('SerpAPI search error:', error);
      return NextResponse.json({ 
        error: 'אירעה שגיאה בחיפוש',
        message: error.message,
        params: searchParams
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API route error:', error);
    
    return NextResponse.json({ 
      error: 'שגיאה פנימית',
      message: error.message
    }, { status: 500 });
  }
} 