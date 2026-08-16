import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isPublished } from '@/lib/content';
import { withBase } from '@/lib/paths';

export async function GET(context: { site?: URL }) {
  const stories = (await getCollection('stories')).filter(isPublished);
  return rss({
    title: '新潟ペアリングラボ',
    description: '新潟清酒と食の一次情報・現場実証・ペアリング記録。',
    site: context.site
      ? new URL(withBase('/'), context.site)
      : 'https://ruharuhachan.github.io/niigata-pairing-lab/',
    items: stories.map((story) => ({
      title: story.data.title,
      description: story.data.summary,
      pubDate: new Date(`${story.data.publishedAt}T00:00:00+09:00`),
      link: `stories/${story.id}/`,
    })),
  });
}
