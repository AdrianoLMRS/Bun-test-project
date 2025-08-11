import axios from 'axios'
import { JSDOM } from 'jsdom'

import { getRamdomUserAgent, selectors } from './utils'
import type { ProductType } from './types';

// Function to fetch results from Amazon based on the search keyword
export async function scrapeAmazonSearch(keyword: string, maxRetries = 3, retryCount = 0) {
    try {
        if (retryCount > 0) {
            // Delay increasing exponentially with the number of retries
            await new Promise(f => setTimeout(f, 5000 * Math.pow(2, retryCount)));
        }

        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

        const userAgent = getRamdomUserAgent();

        // Fetch the HTML content of the page
        const response = await axios.get(url, {
            headers: { 'User-Agent': userAgent }
        });

        // Parse the HTML content using JSDOM
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        // Select all product items from the search results
        const productItems = document.querySelectorAll(selectors.items);
        let products: ProductType[] = [];

        // Extract details for each product
        productItems.forEach(item => {

            const title = item.querySelector(selectors.title)?.textContent?.trim() || null;

            // Locate and parse the product rating
            const ratingText = item.querySelector(selectors.rating)?.textContent?.trim() || null;
            const ratingMatch = ratingText?.match(/[0-9.]+/); // Get the numeric part of the rating
            // Convert the rating to a float, or null if not found
            const rating = ratingMatch ? parseFloat(ratingMatch[0]) : null;

            const numReviews = item.querySelector(selectors.reviews)?.textContent?.trim() || null;

            const imageUrl = (item.querySelector(selectors.image) as HTMLImageElement)?.src || null;

            // Only add the product if all necessary details are present
            if (title && rating && numReviews && imageUrl) {
                products.push({ title, rating, numReviews, imageUrl });
            };
        });

        console.log(`Found ${products.length} products for keyword: ${keyword}`);

        // Return the list of products found
        return products;
    } catch (error) {
        // Handle errors and attempt retries up to a maximum (maxRetries)
        console.error(`Retry ${retryCount + 1}: Error fetching data: ${error}`);
        if (retryCount < maxRetries) {
            console.log('Retrying after error');
            return scrapeAmazonSearch(keyword, maxRetries, retryCount + 1); // Retry with incremented count
        } else {
            throw new Error(`Max retries reached ${maxRetries}. Failed to fetch data for keyword: ${keyword}`);
        }
    }
}