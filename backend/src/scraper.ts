import axios from 'axios'
import { JSDOM } from 'jsdom'

import { getRamdomUserAgent, selectors, getIP } from './utils'
import { getProxyList } from './proxy/utils'
import type { ProductType } from './types';

// Function to fetch results from Amazon based on the search keyword
export async function scrapeAmazonSearch(keyword: string, maxRetries = 3, retryCount = 0) {
    // Validate the keyword
    if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
        throw new Error('Invalid keyword provided');
    }

    // Fetch a list of proxies (optional, can be used for rotating requests)
    const proxyList = await getProxyList();
    // Get a random proxy from the list
    const proxyUrl = proxyList[Math.floor(Math.random() * proxyList.length)];

    let proxyHost = '';
    let proxyPort = 0;
    
    if (proxyUrl) {
        const [ip, portStr] = proxyUrl.split(':');
        proxyHost = String(ip);
        proxyPort = Number(portStr);
    }

    console.log(`Proxy port: ${proxyPort} | Proxy host: ${proxyHost}\nIp used: ${await getIP(proxyHost, proxyPort)}`);

    try {
        if (retryCount > 0) {
            // Delay increasing exponentially with the number of retries
            await new Promise(f => setTimeout(f, 5000 * Math.pow(2, retryCount)));
        }

        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

        const userAgent = getRamdomUserAgent();

        // Fetch the HTML content of the page
        const response = await axios.get(url, {
            headers: {
                'User-Agent': userAgent,
                'referer': 'https://google.com',
            },
            proxy: {
                protocol: 'http',
                host: proxyHost,
                port: proxyPort,
            },
            timeout: 15000 * (retryCount + 1), // Increase timeout with each retry
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