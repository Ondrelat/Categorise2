// app/lib/articles.ts
import prisma from './db/db';
import { articleClassement, Article, Comment } from '@/app/types';

import { z } from 'zod';
import { ContentSection } from '@/app/types';


export const BaseSchema = z.object({
  // Remove type from here if it's defined
  contentJson: z.string().min(10),
  categoryId: z.string(),
  isActive: z.boolean().default(true),
});

// Définir un schéma par type
const ForumSchema = BaseSchema.extend({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
});

const ApprentissageSchema = BaseSchema.extend({
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  title: z.literal(undefined), // empêche le champ "title"
});

const ClassementSchema = BaseSchema.extend({
  imageUrl: z.string().url("URL d'image invalide").optional(),
  title: z.literal(undefined), // empêche aussi "title"
});

const MediaSchema = BaseSchema.extend({
});

const GenericSchema = BaseSchema.extend({
  type: z.literal("Generic"), // Ajoute une valeur unique
  title: z.literal(undefined),
});

export const ArticleSchema = z.discriminatedUnion('type', [
  ForumSchema.extend({ type: z.literal('Forum') }),
  ApprentissageSchema.extend({ type: z.literal('Apprentissage') }),
  ClassementSchema.extend({ type: z.literal('Classement') }),
  MediaSchema.extend({ type: z.literal('Media') }),
  GenericSchema.extend({ type: z.literal('Generic') })
]);

export type ArticleInput = z.infer<typeof ArticleSchema>;


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

// lib/articles.ts

export async function getTutorialsByCategoryGroupedByLevel(categoryTitle: string) {
  const decodedTitle = decodeURIComponent(categoryTitle);

  const tutorials = await prisma.tutorial.findMany({
    where: {
      category: {
        name: decodedTitle
      }
    },
    select: {
      id: true,
      title: true,
      contentJson: true,
      level: true
    },
    orderBy: {
      level: 'asc'
    }
  });

  // Regrouper par levele
  const grouped = tutorials.reduce((acc, tutorial) => {
    const level = tutorial.level || 'UNDEFINED';
    if (!acc[level]) acc[level] = [];
    acc[level].push({
      ...tutorial,
      title: tutorial.title ?? 'Untitled', // ou undefined
    });
    return acc;
  }, {} as Record<string, Article[]>);

  return grouped;
}


export async function getDiscussions(
  categoryTitle: string,
): Promise<Article[]> {
  const categoryTitleDecode = decodeURIComponent(categoryTitle);
  console.log("categoryTitle", categoryTitle);
  try {
    const articles = await prisma.discussion.findMany({
      where: {
        category: {
          name: categoryTitleDecode
        },
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
    return articles.map(article => ({
      ...article,
      title: article.title || 'Untitled' // Fallback for TypeScript
    })) as Article[];
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
}



export async function getDiscussionWithComments(id: string) {
  const discussion = await prisma.discussion.findUnique({
    where: { id }
  });

  if (!discussion) {
    return null;
  }

  // Récupérer tous les commentaires associés à la discussion
  const allComments = await prisma.comment.findMany({
    where: {
      discussionId: id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // Ajouter le champ replies manuellement
  allComments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Organiser les commentaires en arbre
  allComments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id);

    if (commentWithReplies) {
      if (comment.parentId === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      }
    }
  });

  return {
    ...discussion,
    comments: rootComments
  };
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

export async function getMissingArticleTypes(categoryName: string): Promise<ContentSection[]> {
  const startTime = performance.now();
  const typesManquants: ContentSection[] = [];

  const category = await prisma.categories.findFirst({
    where: { name: categoryName },
    include: {
      articlesClassement: {
        select: { articleId: true },
        take: 1,
      },
      discussions: {
        select: { id: true },
        take: 1,
      },
      tutorials: {
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!category) {
    throw new Error(`Category with name "${categoryName}" not found`);
  }

  if (category.articlesClassement.length === 0) typesManquants.push('Classement');
  if (category.discussions.length === 0) typesManquants.push('Forum');
  if (category.tutorials.length === 0) typesManquants.push('Apprentissage');

  const executionTime = performance.now() - startTime;
  console.log(`getMissingArticleTypes - Temps d'exécution: ${executionTime.toFixed(2)}ms`);

  return typesManquants;
}
