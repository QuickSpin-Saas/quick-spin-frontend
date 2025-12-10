import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  noFollow?: boolean
  canonicalUrl?: string
}

export function SEO({
  title,
  description = APP_DESCRIPTION,
  keywords = [],
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false,
  canonicalUrl,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME
  const fullKeywords = ["microservices", "redis", "rabbitmq", "elasticsearch", "kubernetes", "managed services", ...keywords].join(", ")
  const defaultImage = "/og-image.png"
  const fullImage = image || defaultImage
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickspin.io"
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl

  const robots = []
  if (noIndex) robots.push("noindex")
  if (noFollow) robots.push("nofollow")
  if (robots.length === 0) robots.push("index, follow")

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={author || "QuickSpin Team"} />
      <meta name="robots" content={robots.join(", ")} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={`${APP_NAME} - ${description}`} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@quickspin" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={`${APP_NAME} - ${description}`} />
      
      {/* Article specific */}
      {type === "article" && (
        <>
          <meta property="article:author" content={author || "QuickSpin Team"} />
          <meta property="article:publisher" content="QuickSpin" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#667eea" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="application-name" content={APP_NAME} />
      <meta name="msapplication-TileColor" content="#667eea" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === "article" ? "Article" : "WebSite",
            name: fullTitle,
            description: description,
            url: fullUrl,
            image: fullImage,
            publisher: {
              "@type": "Organization",
              name: APP_NAME,
              url: siteUrl,
              logo: {
                "@type": "ImageObject",
                url: "/logo.png",
              },
            },
            ...(type === "article" && {
              author: {
                "@type": "Person",
                name: author || "QuickSpin Team",
              },
              datePublished: publishedTime,
              dateModified: modifiedTime,
            }),
          }),
        }}
      />
    </>
  )
}

export function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickspin.io"
  
  const routes = [
    { url: "/", lastmod: new Date().toISOString(), changefreq: "daily", priority: 1.0 },
    { url: "/auth/login", lastmod: new Date().toISOString(), changefreq: "monthly", priority: 0.8 },
    { url: "/auth/signup", lastmod: new Date().toISOString(), changefreq: "monthly", priority: 0.8 },
    { url: "/auth/forgot-password", lastmod: new Date().toISOString(), changefreq: "monthly", priority: 0.5 },
    { url: "/dashboard", lastmod: new Date().toISOString(), changefreq: "daily", priority: 1.0 },
    { url: "/dashboard/services", lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.9 },
    { url: "/dashboard/services/create", lastmod: new Date().toISOString(), changefreq: "weekly", priority: 0.8 },
    { url: "/dashboard/billing", lastmod: new Date().toISOString(), changefreq: "weekly", priority: 0.7 },
    { url: "/dashboard/settings", lastmod: new Date().toISOString(), changefreq: "weekly", priority: 0.7 },
    { url: "/dashboard/admin", lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.6 },
    { url: "/dashboard/admin/users", lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.6 },
    { url: "/dashboard/admin/services", lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.6 },
  ]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export function generateRobotsTxt() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickspin.io"
  
  return `User-agent: *
Allow: /

# Block admin pages from indexing
Disallow: /dashboard/admin

# Block API routes
Disallow: /api

# Block authentication pages from indexing
Disallow: /auth

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Host
Host: ${siteUrl}`
}