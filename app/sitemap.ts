import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.dicteeinteractive.fr',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://www.dicteeinteractive.fr/regle',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Ajoutez d'autres URLs statiques ici
    ]
}