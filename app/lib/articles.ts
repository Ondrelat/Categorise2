// app/lib/articles.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getArticleById(id: string) {
  const debutArticle = performance.now();

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      }
    });

    const finArticle = performance.now();
    console.log(`Temps d'exécution : ${finArticle - debutArticle} ms`);

    if (!article) {
      throw new Error(`Article avec l'ID ${id} non trouvé`);
    }

    return article;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getArticleClassementById(id: string) {
  const debutArticle = performance.now();
  console.log("Début de la recherche d'article");

  try {
    const article = await prisma.articleClassement.findUnique({
      where: {
        id: id,
      }
    });

    const finArticle = performance.now();
    console.log("Fin de la recherche d'article");
    console.log(`Temps d'exécution : ${finArticle - debutArticle} ms`);

    if (!article) {
      throw new Error(`Article avec l'ID ${id} non trouvé`);
    }

    return article;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFilmsSortedByRating(limit: number = 50) {
  const startTime = performance.now();
  console.log("Début de la récupération des films triés");

  try {
    const films = await prisma.articleClassement.findMany({
      where: {
        // S'assurer que nous avons une note et un nombre minimum de votes
        averageRatingIMDB: { not: null },
        titleType: "movie",
        numVotesIMDB: {
          not: null,
          // Optionnel : filtre pour avoir un minimum de votes (ex: 1000)
          gt: 50000
        }
      },
      orderBy: {
        averageRatingIMDB: 'desc' // Tri par note décroissant
      },
      take: limit, // Limite le nombre de résultats
      select: {
        id: true,
        tconst: true,
        averageRatingIMDB: true,
        numVotesIMDB: true,
        titre_fr: true,
        titre_en: true,
        image_url: true,
        createdAt: true
      }
    });

    const endTime = performance.now();
    console.log(`Films récupérés en ${endTime - startTime} ms`);
    console.log(`Nombre de films trouvés : ${films.length}`);

    return films;
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    throw new Error('Erreur lors de la récupération des films');
  } finally {
    await prisma.$disconnect();
  }
}
