import express from 'express'
import { scrapeAmazonSearch } from './src/scraper.ts'

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/scrape', async (req, res) => {
    const { keyword } = req.query
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' })
    try {
        const data = await scrapeAmazonSearch(keyword)
        if (data.length === 0) throw new Error("No products found");
        res.json(data)
    } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        res.status(500).json({ error: errorMessage });
    };
});

app.listen(PORT);