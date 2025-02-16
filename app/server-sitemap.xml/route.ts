import { MetadataRoute } from 'next'
import fs from 'fs/promises'
import path from 'path'

function generateSitemapXml(urls: { loc: string; lastmod: string }[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>
  `).join('')}
</urlset>`;
}

export async function GET() {
    const filePath = path.join(process.cwd(), 'app', 'lib', 'data', 'helperData.json')
    const jsonData = await fs.readFile(filePath, 'utf8')
    const rulesData = JSON.parse(jsonData)

    const urls = Object.keys(rulesData).map((id) => ({
        loc: `${process.env.SITE_URL}/regle/${id}`,
        lastmod: new Date().toISOString(),
    }))

    const sitemapContent = generateSitemapXml(urls)

    return new Response(sitemapContent, {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}