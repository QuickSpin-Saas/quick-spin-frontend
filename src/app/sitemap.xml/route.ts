import { generateSitemap } from "@/components/ui/seo"

export async function GET() {
  const sitemap = generateSitemap()
  
  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}