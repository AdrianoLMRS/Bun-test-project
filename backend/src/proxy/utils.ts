import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

// Function to fetch a list of proxies from a public source
export async function getProxyList(): Promise<string[]> {
    try {
        console.log('Fetching proxy list...');
        const res = await axios.get('https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt');
        return res.data.split('\n').filter(Boolean); // Filter empty lines
    } catch (error) {
        console.error('Error fetching proxy list:', error);
        return []; // Return an empty array if fetching fails
    }
}

// Function to get a random proxy from the list
export const getRamdomProxy = (proxyList: string[]): string | null => {
    if (!proxyList || proxyList.length === 0) {
        console.error('Proxy list is empty or not provided');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * proxyList.length);
    return `${proxyList[randomIndex]}`;
}

// Function to create a SocksProxyAgent from a proxy URL
export async function getSocksProxyAgent(proxyUrl: string) {
    if (!proxyUrl) {
        console.error('No proxy URL provided');
        return null;
    }
    try {
        return new SocksProxyAgent(proxyUrl);
    } catch (err) {
        console.error('Error creating SocksProxyAgent:', err);
        return null;
    }
}