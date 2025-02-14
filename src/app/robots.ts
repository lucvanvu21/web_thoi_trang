import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // console.log('robots');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/admin/*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
