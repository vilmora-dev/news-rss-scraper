import { ExternalLink, Clock } from 'lucide-react';

const CATEGORY_CONFIG = {
    politics:    { color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/20',   label: 'Politics' },
    science:     { color: 'text-sky-400',    bg: 'bg-sky-500/10 border-sky-500/20',       label: 'Science' },
    environment: { color: 'text-green-400',   bg: 'bg-green-500/10 border-green-500/20',     label: 'Environment' },
    technology:  { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Technology' },
    top:         { color: 'text-yellow-400',   bg: 'bg-yellow-500/10 border-yellow-500/20',     label: 'Top Story' },
};

function timeAgo(date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsCard({ article }) {
    const cfg = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG.top;

    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-xl overflow-hidden border border-cyan-700/30 hover:border-cyan-600/50 bg-slate-900/40 hover:bg-slate-800/70 transition-all duration-200 hover:-translate-y-1"
        >

             {/* Background image */}
            <div className="inset-0">
                <img
                    src={article.image}
                    alt=""
                    className="w-full h-full max-h-45 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'; }}
                />
                <div className="inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <div className={`category-badge ${cfg.color} ${cfg.bg} border rounded self-start px-1 tracking-wide font-serif text-xs`}>
                    {cfg.label}
                </div>

                <h4 className="text-sm font-semibold text-white group-hover: leading-snug line-clamp-3 transition-colors font-mono tracking-wide flex-1">
                    {article.title}
                </h4>

                {article.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {article.description}
                    </p>
                )}

                <div className="flex items-center gap-2 text-slate-600 text-[11px] font-serif pt-1 border-t border-slate-600/40">
                    <Clock size={9} />
                    <span>{timeAgo(article.publishedAt)}</span>
                    <span className="text-slate-700">·</span>
                    <span className="truncate">{article.source}</span>
                    <ExternalLink size={9} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
            </div>
        </a>
    );
}