# News RSS Crawler + Scraper

A full-stack news aggregator that delivers real-time articles from major RSS feeds with smart image handling and semantic categorization.

---

## Features

- **Live RSS Crawling** - Auto-refreshes every 5 minutes from major news outlets
- **Smart Image Pipeline** - Uses RSS images when available, falls back to OG scraping from article URLs, or categorized Unsplash images as final fallback
- **Semantic Classification** - Automatically sorts articles into sections (Politics, Tech, Science, etc.)
- **Lazy Loading** - Images load asynchronously for instant feed rendering
- **Article Caching** - Holds content for 15 minutes to reduce API load
- **Clean UI** - Responsive article cards organized by sections + search bar and sidebar
---

## Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=Vite&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)
![Lucide](https://img.shields.io/badge/lucide--react-000000?logo=lucide&logoColor=white&style=for-the-badge)

### Backend
![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white&style=for-the-badge)
[![RSS-Parser](https://img.shields.io/badge/rss--parser-used-blue?logo=javascript&style=flat)](https://www.npmjs.com/package/rss-parser)
[![Cheerio](https://img.shields.io/badge/cheerio-powered-brightgreen?logo=javascript&style=flat)](https://cheerio.js.org/)


---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/vilmora-dev/news-rss-scraper.git
cd news-crawler

# Install dependencies
npm install && npm run dev

# Run 
npm run dev
```

This starts two processes concurrently:

- **Vite** dev server at `http://localhost:5173`
- **Express** RSS/scraper proxy at `http://localhost:3001`

---

## Semantic Classification

Articles are classified client-side in `useCrawler.js`. Each article's title and description are scored against four keyword dictionaries using whole-word regex matching. The highest-scoring category wins; articles with zero matches fall back to `top`.

```
politics     → congress, senate, election, legislation, white house ...
science      → research, discovery, nasa, quantum, genome, telescope ...
environment  → climate, emissions, wildfire, biodiversity, glacier ...
technology   → ai, semiconductor, startup, openai, autonomous, llm ...
```

---

## News Sources

| Section | Sources |
|---|---|
| Top US | NYT Homepage, NPR News, BBC US & Canada, CBS News |
| Politics | NYT Politics, NPR Politics, BBC Politics, Politico |
| Science | NYT Science, ScienceDaily, BBC Science, New Scientist |
| Environment | NYT Climate, The Guardian Environment, Grist, BBC Science |
| Technology | NYT Technology, Wired, Ars Technica, TechCrunch |

---

## License

MIT