import type { MetadataRoute } from 'next'

const SITE_URL = 'https://zanzifitfestival.com'

// Static route list — this site has no dynamic/CMS-driven routes, so a
// plain array is simpler and more reliable than trying to derive one from
// the filesystem. Add a line here whenever a new top-level page is added.
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/festival', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/festival/cycling', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/festival/hyrox', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/register', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/accommodation', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/experience', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/leadership', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/partnership', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
