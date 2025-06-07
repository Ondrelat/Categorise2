// app/lib/articles.ts
import { prisma } from './prisma';

export async function getCategoryId(categoryName?: string): Promise<string | undefined> {
  if (!categoryName) {
    return undefined;
  }

  try {
    const category = await prisma.categories.findFirst({
      where: { 
        name: categoryName,
        isActive: true // Optionnel: ne récupérer que les catégories actives
      }
    });
    
    return category?.id;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return undefined;
  }
}

export async function fetchMyList(userId: string, categoryName?: string) {
  console.log("categoryName", categoryName)
  try {
    const categoryId = await getCategoryId(categoryName);

    const userRankings = await prisma.articleClassementUserData.findMany({
      where: {
        userId,
        // Filtrer seulement les articles qui sont dans une liste (onList = true)
        onList: true,
        ...(categoryId && { categoryId })
      },
      orderBy: [
        {
          rank: {
            sort: 'asc',
            nulls: 'last' // Les éléments sans rang à la fin
          }
        },
        {
          createdAt: 'desc' // Ordre secondaire par date de création
        }
      ],
      include: {
        article: true,
        category: true,
      }
    });

    console.log("userRankings", userRankings);

    // Liste d'articles enrichis avec les infos de classement personnalisées
    const articles = userRankings.map((userRanking) => ({
      ...userRanking.article,
      rank: userRanking.rank,
      rating: userRanking.rating,
      liked: userRanking.liked,

      onList: userRanking.onList,
      categoryName: userRanking.category?.name || null,
      rankCategorise: null as number | null,
      scoreCategorise: null as number | null,
    }));

    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste:', error);
    throw new Error('Impossible de récupérer la liste des articles');
  }
}

// utils/classement.ts
export async function ReOrderMyList(ranking: { id: string }[], userId: string) {
  if (!userId) throw new Error("User ID manquant");
  if (!ranking || ranking.length === 0) return { success: false, message: 'Classement vide' };

  try {
    const updateOps = ranking.map((article, index) => {
      return prisma.articleClassementUserData.upsert({
        where: {
          userId_articleId: {
            userId,
            articleId: article.id,
          },
        },
        update: {
          rank: index + 1, // classement commence à 1
        },
        create: {
          userId,
          articleId: article.id,
          rank: index + 1,
        },
      });
    });

    await prisma.$transaction(updateOps); // exécute toutes les upserts en une seule transaction

    return { success: true };
  } catch (error) {
    console.error("Erreur lors du reorderClassement :", error);
    return { success: false, message: 'Erreur serveur' };
  }
}

// utils/classement.ts
export async function AddOrRemoveToMyList(articleId: string, onList: boolean, userId: string, categoryName: string) {
  const categoryId = await getCategoryId(categoryName);
  const result = await prisma.articleClassementUserData.upsert({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
    update: {
      onList,
    },
    create: {
      userId,
      articleId,
      categoryId,
      onList,
    },
  });

  console.log("ajout list" + categoryId + result)

  return { success: true };
}
