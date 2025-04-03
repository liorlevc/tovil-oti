# Google Maps Business Extractor

A web application that extracts business information from Google Maps URLs. This tool allows you to enter a Google Maps URL and get details like business name, phone number, address, website, rating, and more.

## Features

- Extract business details from Google Maps URLs
- Display results in a clean, sortable table
- Support for both single business listings and search results
- Clean, modern UI with responsive design

## Setup

### Prerequisites

- Node.js (v18 or newer)
- An API key from [SerpAPI](https://serpapi.com/) (for production use)

### Installation

1. Clone this repository
```bash
git clone <your-repo-url>
cd maps
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
SERPAPI_API_KEY=your_serpapi_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Enter a Google Maps URL in the input field
   - Example: `https://www.google.com/maps/place/Starbucks/...`
   - The URL should be from Google Maps and contain business information

2. Click "Extract" to process the URL
   - The application will use SerpAPI to retrieve business data
   
3. View the results in the table below the form
   - Results include business name, contact information, and ratings

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React Hook Form](https://react-hook-form.com/) - Form validation
- [SerpAPI](https://serpapi.com/) - API for Google Maps data extraction
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational purposes. Please ensure you comply with Google's Terms of Service and SerpAPI's Terms of Service when using this application. 