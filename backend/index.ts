import express from 'express'

import { scrapeAmazonSearch } from './src/scraper.ts'

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');             // Allow all origins for simplicity (can be changed)
    res.header('Access-Control-Allow-Methods', 'GET');          // Allow only GET requests
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/scrape', async (req, res) => {
    const { keyword } = req.query
    // TODO: Server-side validation form validation
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' })
    try {
        const data = await scrapeAmazonSearch(`${keyword}`)
        if (data.length === 0) throw new Error("No products found...");
        res.json(data)
    } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        res.status(500).json({ error: errorMessage });
        // TODO: Handle specific error cases (e.g., network issues, parsing errors)
    };
});

app.listen(PORT);
console.log(`Server is running on http://localhost:${PORT}`);