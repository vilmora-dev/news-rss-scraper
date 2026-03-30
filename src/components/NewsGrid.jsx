import NewsCard from './NewsCard';

export default function NewsGrid({ articles, title, subtitle }) {
    if (!articles.length) return null;
        
    return (
        <div>
            {(title || subtitle) && (
                <div className="flex items-baseline gap-3 mb-4">
                {title && (
                    <h3 className="font-display text-xl font-bold text-ink-100">{title}</h3>
                )}
                {subtitle && (
                    <span className="font-mono text-xs text-ink-600 tracking-wider uppercase">{subtitle}</span>
                )}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {articles.map((article, i) => (
                <div
                    key={article.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'both' }}
                >
                    <NewsCard article={article} />
                </div>
                ))}
            </div>
        </div>
    );
}
