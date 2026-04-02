import express, { urlencoded } from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';
import Parser from 'rss-parser'

const app = express();
const parser = new Parser({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
    customFields: {
        item: [
            ['media:content', 'mediaContent', { keepArray: false }],
            ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
            ['enclosure', 'enclosure'],
        ]
    }
})

app.use(cors());
app.use(express.json());

const FEEDS = {
  top: [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://feeds.npr.org/1001/rss.xml',
    'https://www.cbsnews.com/latest/rss/main',
    'https://feeds.bbci.co.uk/news/rss.xml',
  ],
  politics: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    'https://feeds.npr.org/1014/rss.xml',
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
  ],
  science: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
    'https://www.sciencedaily.com/rss/top/science.xml',
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'https://www.newscientist.com/feed/home/',
  ],
  environment: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml',
    'https://www.theguardian.com/environment/rss',
    'https://grist.org/feed/',
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'https://insideclimatenews.org/feed/',
  ],
    technology: [
        'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
        'https://feeds.arstechnica.com/arstechnica/index',
        'https://techcrunch.com/feed/',
        'https://www.wired.com/feed/rss',
    ],
};

// In-memory cache: { key: { data, timestamp } }
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCache(key, data){
    const entry = cache.get(key);
    if (!entry) return null;
    if(Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCache(key, data){
    cache.set(key, { data, timestamp: Date.now() });
}

async function fetchOgImage(url) {
    try {
        const res = await fetch(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0',
            }
        });
        // Only read enough HTML to find the og:image in the <head>
        const reader = res.body.getReader();
        let html = '';
        while (true) {
            const { done, value } = await reader.read();
            html += new TextDecoder().decode(value);
            // Stop once we're past </head> — no need for the full page
            if (done || html.includes('</head>')) {
                reader.cancel();
                break;
            }
        }
        const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                   || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        return match?.[1] ?? null;
    } catch {
        return null;
    }
}

async function extractImage(item) {
    const mediaUrl = item.mediaContent?.$?.url ?? '';
    const thumbUrl = item.mediaThumbnail?.$?.url ?? '';
    const content  = item['content:encoded'] || item.content || item.summary || '';

    if (mediaUrl) return mediaUrl;
    if (thumbUrl) return thumbUrl;
    if (item.enclosure?.url && item.enclosure?.type?.startsWith('image')) return item.enclosure.url;

    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) return imgMatch[1];

    const siteImg = await fetchOgImage(item.link || item.guid);
    return siteImg ?? null;
}

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

async function fetchFeed(url) {
    const cached = getCache(url);
    if (cached) return cached;
    
    const feed = await parser.parseURL(url);
    const rawItems = (feed.items || []).slice(0, 15);

    const items = await Promise.all(rawItems.map(async item => ({
        title: item.title || '',
        description: cleanText(item.contentSnippet || item.summary || item.content || ''),
        url: item.link || item.guid || '',
        source: feed.title || new URL(url).hostname.replace('www.', ''),
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        image: await extractImage(item),
    })));

    setCache(url, items);
    return items;
}

async function fetchFeedWithTimeout(url, ms = 5000) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Feed timeout')), ms)
    );
    return Promise.race([fetchFeed(url), timeout]);
}

app.get('/api/feeds', async (req, res) => {
    const { section = 'dashboard' } = req.query;
    let feedUrls = [];
    if(section === 'dashboard'){
        feedUrls = [
            ...FEEDS.top,
            ...FEEDS.politics.slice(0, 2),
            ...FEEDS.science.slice(0, 5),
            ...FEEDS.environment.slice(0, 2),
            ...FEEDS.technology.slice(0, 5),
        ]
    } else if(FEEDS[section]){
        feedUrls = FEEDS[section];
    } else{
        return res.status(400).json({ error: `Unknown section: ${section}`});
    }

    const results = await Promise.allSettled(feedUrls.map(url => fetchFeedWithTimeout(url)));

    const allItems = [];
    const errors = [];

    results.forEach((result, i) => {
        if(result.status === 'fulfilled'){
            allItems.push(...result.value);
        }else{
            errors.push({ url: feedUrls[i], error: result.reason?.message });
            console.warn(`Failed: ${feedUrls[i]} — ${result.reason?.message}`);
        }
    });

    const seen = new Set();
    const unique = allItems.filter(a => {
        const key = a.title.slice(0, 50).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({
        items: unique.slice(0, 80),
        total: unique.length,
        errors: errors.length ? errors : undefined,
        cachedAt: new Date().toISOString(),
    });
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', cached: cache.size });
});

ViteExpress.listen(app, 3000, () =>
  console.log('Server running at http://localhost:3000')
)