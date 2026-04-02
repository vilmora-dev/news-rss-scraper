import NewsGrid from './NewsGrid';

const SECTION_META = {
  top: {
    title: 'Top News',
    subtitle: 'Leading stories from across the nation',
    accent: 'text-yellow-200',
    bar: 'bg-yellow-200',
  },
  politics: {
    title: 'Politics',
    subtitle: 'Government, policy, and political developments',
    accent: 'text-orange-300',
    bar: 'bg-orange-300',
  },
  science: {
    title: 'Science',
    subtitle: 'Discoveries, research, and scientific breakthroughs',
    accent: 'text-sky-300',
    bar: 'bg-sky-300',
  },
  environment: {
    title: 'Environment',
    subtitle: 'Climate, ecology, and sustainability news',
    accent: 'text-green-300',
    bar: 'bg-green-300',
  },
  technology: {
    title: 'Technology',
    subtitle: 'Tech, innovation, and the digital world',
    accent: 'text-purple-300',
    bar: 'bg-purple-300',
  },
};

function Skeleton({ className = '' }) {
  return (
    <div className={`bg-ink-800/60 animate-pulse rounded ${className}`} />
  );
}

export default function SectionPage({ section, articles, loading }) {
  const meta = SECTION_META[section] || SECTION_META.top;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Section header */}
      <div className="relative pb-4 border-b border-ink-700/50">
        <div className={`absolute left-0 top-0 w-1 h-full ${meta.bar} rounded-full`} />
        <div className="pl-4">
          <h1 className={`font-display text-3xl font-bold ${meta.accent}`}>{meta.title}</h1>
          <p className="text-ink-500 text-sm mt-1 font-sans">{meta.subtitle}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => 
          
            <div className="flex gap-3 p-3 rounded-md bg-ink-800/40 border border-ink-700/30">
                <Skeleton className="flex-shrink-0 w-20 h-16 rounded-sm" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="w-16 h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-4/5 h-4" />
                    <Skeleton className="w-24 h-3" />
                </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {!loading && articles.length > 0 && (
        <NewsGrid articles={articles} />
      )}

      {/* Empty */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-24 text-ink-600">
          <div className="text-4xl mb-3">📡</div>
          <div className="font-display text-xl text-ink-500">No articles found</div>
          <div className="text-sm mt-2">Try refreshing or check back shortly</div>
        </div>
      )}
    </div>
  );
}
