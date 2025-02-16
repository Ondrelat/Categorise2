/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://categorise.vercel.app/',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://categorise.vercel.app/server-sitemap.xml',
    ],
  },
  outDir: './public', // Assurez-vous que c'est le bon dossier de sortie
}