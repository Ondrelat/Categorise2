export async function GET() {
    const content = `User-agent: *
  Allow: /
  Sitemap: https://www.dicteeinteractive.fr/sitemap.xml
  Sitemap: https://www.dicteeinteractive.fr/server-sitemap.xml`;

    return new Response(content, {
        headers: { 'Content-Type': 'text/plain' },
    });
}