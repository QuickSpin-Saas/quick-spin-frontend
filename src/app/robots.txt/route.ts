import { generateRobotsTxt } from "@/components/ui/seo"

export async function GET() {
  const robotsTxt = generateRobotsTxt()
  
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}