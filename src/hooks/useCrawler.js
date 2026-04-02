import { useState, useEffect, useCallback } from "react";

// Keywords for semantic filtering
const CATEGORY_KEYWORDS = {
  politics: ['congress', 'senate', 'president', 'election', 'democrat', 'republican',
    'white house', 'legislation', 'vote', 'campaign', 'government', 'policy',
    'political', 'biden', 'trump', 'house representative', 'governor', 'mayor',
    'bill', 'law', 'partisan', 'gop', 'administration', 'lawmaker', 'ballot',
    'supreme court', 'judiciary', 'federal', 'tariff', 'immigration'],

  science: ['research', 'study', 'scientist', 'discovery', 'experiment', 'nasa',
    'space', 'physics', 'biology', 'chemistry', 'genome', 'universe', 'planet',
    'fossil', 'archaeology', 'quantum', 'particle', 'cells', 'brain', 'vaccine',
    'clinical trial', 'mutation', 'protein', 'telescope', 'asteroid', 'mission',
    'laboratory', 'hypothesis', 'findings', 'journal', 'published'],

  environment: ['climate', 'carbon', 'emissions', 'global warming', 'fossil fuel',
    'renewable', 'solar', 'wind energy', 'wildfire', 'drought', 'flood', 'ocean',
    'species', 'biodiversity', 'pollution', 'epa', 'sustainability', 'deforestation',
    'glacier', 'arctic', 'weather', 'hurricane', 'tornado', 'coral reef', 'conservation',
    'methane', 'greenhouse', 'net zero', 'habitat', 'biology', 'botany', 'geology', 
    'endengered', 'geology', 'rainforest', 'forest', 'environment'], 

  technology: ['ai', 'artificial intelligence', 'software', 'hardware', 'startup',
    'silicon valley', 'app', 'data', 'cyber', 'robot', 'automation', 'chip',
    'semiconductor', 'smartphone', 'electric vehicle', 'tesla', 'apple', 'google',
    'microsoft', 'meta', 'openai', 'machine learning', 'cloud', 'algorithm',
    'programming', 'developer', 'blockchain', 'drone', 'autonomous', 'gpt',
    'llm', 'nvidia', 'model', 'chatbot', 'deepmind'],
};

function classifyArticle(article) {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    const scores = {};

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)){
        scores[cat] = keywords.reduce((acc, kw)=>{
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const matches = (text.match(new RegExp(`\\b${escaped}\\b`, 'g')) || []).length;
            return acc + matches;
        }, 0);
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    return sorted[0][1] > 0 ? sorted[0][0] : 'top';
}

const FALLBACK_IMAGES = {
    politics: [
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    ],
    science: [
        'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&q=80',
    ],
    environment: [
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    ],
    technology: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    ],
    top: [
        'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=800&q=80',
    ],
};

let _imgCounters = {};

function getFallbackImage(category) {
  const imgs = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.top;
  _imgCounters[category] = (_imgCounters[category] || 0);
  const img = imgs[_imgCounters[category] % imgs.length];
  _imgCounters[category]++;
  return img;
}

function normalizedItem(raw){
    const category = classifyArticle(raw);
    // id, title, description, url, source, publishedAt(timestamp), category 
    return {
        id: raw.url || raw.title || Math.random().toString(36), 
        title: raw.title || 'Untitled', 
        description: raw.description || '', 
        url: raw.url, 
        source: raw.source || 'Unknown',
        publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : new Date(), 
        category,
        image: raw.image || getFallbackImage(category),
    }
}

export function useCrawler(activeSection = 'dashboard') {
    // articles - errors - loadingState - update(timestamp)
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [articles, setArticles] = useState([]); 
    const [lastUpdate, setLastUpdate] = useState(null);
    
    const fetchArticles = useCallback(async ()=>{
        setLoading(true);
        setError(null);
         _imgCounters = {};

        try{
            const res = await fetch(`/api/feeds?section=${activeSection}`);
            if(!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();

            if(data.errors?.length){
                console.warn(`Some feeds failed: ${data.errors}`);
            }

            const normalized = (data.items || []).map(normalizedItem);

            setArticles(prev => {
                if (prev.length === 0) return normalized;
                
                const existingUrls = new Set(prev.map(a => a.url));
                const hasNewArticles = normalized.some(a => !existingUrls.has(a.url));
                
                return hasNewArticles ? normalized : prev;
            });
            setLastUpdate(new Date());
        }
        catch(err){
            setError(err.message);
            console.log(`Error: ${err.message}`);
        }
        finally{
            setLoading(false);
        }
    }, [activeSection]);

    useEffect(() => {
        fetchArticles();
        const interval = setInterval(fetchArticles, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchArticles]);
    
    return { articles, loading, error, lastUpdate, refetch: fetchArticles };
}