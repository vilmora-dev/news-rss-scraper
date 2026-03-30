// SectionPage.jsx
import NewsGrid from './NewsGrid';
import { Loader } from 'lucide-react';

const SECTION_META = {
  top: {
    title: 'Top United States',
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
        <div class="flex items-center justify-center min-h-[200px]">
          <Loader className='animate-spin h-8 w-8 text-white '/>
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
