/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.dicteeinteractive.fr',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.dicteeinteractive.fr/server-sitemap.xml',
    ],
  },
  outDir: './public', // Assurez-vous que c'est le bon dossier de sortie
}