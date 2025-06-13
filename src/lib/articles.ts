// app/lib/articles.ts
import prisma from './db/db';
import { articleClassement, Article } from '@/app/types';


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
  } 
}



export async function getclassementsSortedByRating(
  categoryTitle: string, 
  ratingSource: string,
  userId?: string
) {
  const startTime = performance.now();
  const categoryTitleDecode = decodeURIComponent(categoryTitle);

  const limit = 50;
  const delimiter = (categoryTitleDecode === "Film" || categoryTitleDecode === "Série") ? 20000 : 10000;
  
  // Pour l'instant seul IMDB est supporté, mais structure extensible
  const orderField = ratingSource === 'IMDB' ? 'averageRatingIMDB' : 'averageRatingIMDB';

  try {
    const query = `
      SELECT 
        ac.id,
        ac.tconst,
        ac."averageRatingIMDB",
        ac."numVotesIMDB",
        ac.titre_fr,
        ac.titre_en,
        ac.image_url,
        ac."createdAt"${userId ? ',\n        acud.liked as "liked",\n        acud.rating as "rating"' : ',\n        NULL as "userLiked",\n        NULL as "userRating"'}
      FROM "article_classement" ac
      INNER JOIN "ArticleClassementCategory" acc ON ac.id = acc."articleId"
      INNER JOIN "Categories" c ON acc."categoryId" = c.id${userId ? '\n      LEFT JOIN "ArticleClassementUserData" acud ON ac.id = acud."articleId" AND acud."userId" = $4' : ''}
      WHERE 
        ac."${orderField}" IS NOT NULL
        AND ac."numVotesIMDB" IS NOT NULL
        AND ac."numVotesIMDB" > $1
        AND c.name = $2
      ORDER BY ac."${orderField}" DESC
      LIMIT $3
    `;

    const params = userId 
      ? [delimiter, categoryTitleDecode, limit, userId]
      : [delimiter, categoryTitleDecode, limit];

    const rawResults = await prisma.$queryRawUnsafe<articleClassement[]>(query, ...params);

    const films = rawResults.map(film => ({
      id: film.id,
      tconst: film.tconst,
      averageRatingIMDB: film.averageRatingIMDB,
      numVotesIMDB: film.numVotesIMDB,
      titre_fr: film.titre_fr,
      titre_en: film.titre_en,
      image_url: film.image_url,
      createdAt: film.createdAt,
      rankCategorise: null as number | null,
      scoreCategorise: null as number | null,
      liked: film.liked ?? null,
      rating: film.rating ? parseFloat(film.rating.toString()) : null,
    }));

    const endTime = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`Films récupérés en ${endTime - startTime} ms`);
      console.log(`Nombre de films trouvés : ${films.length}`);
    }

    return films;
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    throw new Error('Erreur lors de la récupération des films');
  }
}

export async function getArticlesByTypeAndCategory(categoryTitle: string, type: string): Promise<Article[]> {
  const startTime = performance.now();
  const categoryTitleDecode = decodeURIComponent(categoryTitle);
  console.log(`Début de la récupération des articles de type ${type} pour la catégorie ${categoryTitleDecode}`);

  try {
    // Requête unique avec jointure implicite
    const articles = await prisma.article.findMany({
      where: {
        category: {
          name: categoryTitleDecode
        },
        type: type
      },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    const endTime = performance.now();
    console.log(`Articles récupérés en ${endTime - startTime} ms`);
    console.log(`Nombre d'articles trouvés : ${articles.length}`);

    return articles;
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles de type ${type}:`, error);
    throw new Error(`Erreur lors de la récupération des articles de type ${type}`);
  }
  // Ne pas déconnecter Prisma à chaque appel
}

export async function likeArticle(articleId: string, liked: boolean, userId: string) {
  await prisma.articleClassementUserData.upsert({
    where: {
      articleId_userId: {
        userId,
        articleId,
      },
    },
    update: {
      liked,
    },
    create: {
      userId,
      articleId,
      liked,
    },
  });

  return { success: true };
}

export async function NoteArticle(articleId: string, rating: number, userId: string) {

  console.log('Note à enregistrer:', rating, typeof rating);
  const result = await prisma.articleClassementUserData.upsert({
    where: {
      articleId_userId: {
        userId,
        articleId,
      },
    },
    update: {
      rating,
    },
    create: {
      userId,
      articleId,
      rating,
    },
  });
  
  console.log("Résultat après upsert:", result);

  console.log({
  userId,
  articleId,
  rating,
  type: typeof rating,
});

  return { success: true };
}

