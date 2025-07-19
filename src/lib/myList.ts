import prisma from './db/db';

export async function getCategoryId(categorySlug?: string): Promise<string | undefined> {
  if (!categorySlug) return undefined;

  try {
    const category = await prisma.categories.findFirst({
      where: { slug: categorySlug, isActive: true }
    });
    return category?.id;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return undefined;
  }
}


type R = {
  id: string;
  articleId: string;
  rank: number | null;
  createdAt: Date;
  article_id: string;
  tconst: string | null;
  averageRatingIMDB: number | null;
  numVotesIMDB: number | null;
  titre_fr: string | null;
  titre_en: string | null;
  image_url: string | null;
  article_createdAt: Date;
  duration: string | null;
  endYear: number | null;
  genres: string | null;
  startYear: number | null;
  titleType: string | null;
  categorySlug: string | null;
  categoryName: string | null;
}

export type MyListItem = Omit<R, 'id' | 'articleId' | 'createdAt' | 'article_id' | 'article_createdAt' | 'categoryName'> & {
  id: string;
  createdAt: Date;
  categoryName: string | null;
  rankCategorise: number | null;
  scoreCategorise: number | null;
};

export async function fetchMyList(userId: string, categorySlug?: string): Promise<MyListItem[]> {
  if (!userId || !categorySlug) throw new Error('Paramètres requis');
  
  try {
    return (await prisma.$queryRawUnsafe<R[]>(`
      SELECT acul.*, ac.id article_id, ac.*, ac."createdAt" article_createdAt,
             c.slug "categorySlug", c.name "categoryName"
      FROM "ArticleClassementUserList" acul
      JOIN "UserList" ul ON acul."listId"=ul.id AND ul."userId"=$1
      JOIN "Categories" c ON ul."categoryId"=c.id AND c.slug=$2 AND c."isActive"
      JOIN "article_classement" ac ON acul."articleId"=ac.id
      WHERE acul."userId"=$1
      ORDER BY acul.rank NULLS LAST, acul."createdAt" DESC
    `, userId, categorySlug)).map((r: R): MyListItem => ({
      id: r.article_id,
      tconst: r.tconst,
      averageRatingIMDB: r.averageRatingIMDB,
      numVotesIMDB: r.numVotesIMDB,
      titre_fr: r.titre_fr,
      titre_en: r.titre_en,
      image_url: r.image_url,
      createdAt: r.article_createdAt,
      duration: r.duration,
      endYear: r.endYear,
      genres: r.genres,
      startYear: r.startYear,
      titleType: r.titleType,
      rank: r.rank,
      categorySlug: r.categorySlug,
      categoryName: r.categoryName,
      rankCategorise: null,
      scoreCategorise: null,
    }));
  } catch (e: unknown) {
    throw new Error(`Erreur liste: ${e instanceof Error ? e.message : 'Inconnue'}`);
  }
}

// Fonction pour récupérer ou créer la UserList correspondant au user + catégorie
async function getOrCreateUserList(userId: string, categorySlug?: string) {
  const categoryId = await getCategoryId(categorySlug);
  if (!categoryId) throw new Error("Catégorie inconnue");

  let list = await prisma.userList.findFirst({
    where: { userId, categoryId }
  });

  if (!list) {
    list = await prisma.userList.create({
      data: {
        userId,
        categoryId,
        name: categorySlug || 'Default',
      },
    });
  }

  return list;
}

export async function AddOrRemoveToMyList(articleId: string, onList: boolean, userId: string, categorySlug?: string) {
  try {
    const list = await getOrCreateUserList(userId, categorySlug);

    if (onList) {
      // Ajouter à la liste
      const result = await prisma.articleClassementUserList.upsert({
        where: {
          listId_articleId: {
            listId: list.id,
            articleId,
          },
        },
        update: {
          // Pas de changement si déjà présent
        },
        create: {
          listId: list.id,
          articleId,
          userId
        },
      });
      console.log("ajout list", list.id, result);
    } else {
      // Retirer de la liste
      await prisma.articleClassementUserList.deleteMany({
        where: {
          listId: list.id,
          articleId,
          userId
        }
      });
      console.log("suppression de la liste", list.id, articleId);
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur AddOrRemoveToMyList :", error);
    return { success: false, message: 'Erreur serveur' };
  }
}

export async function ReOrderMyList(ranking: { id: string }[], userId: string, categorySlug?: string) {
  if (!userId) throw new Error("User ID manquant");
  if (!ranking || ranking.length === 0) return { success: false, message: 'Classement vide' };
  console.log("categorySlug", categorySlug)

  try {
    const list = await getOrCreateUserList(userId, categorySlug);

    const updateOps = ranking.map((article, index) =>
      prisma.articleClassementUserList.upsert({
        where: {
          listId_articleId: {
            listId: list.id,
            articleId: article.id,
          },
        },
        update: {
          rank: index + 1,
        },
        create: {
          listId: list.id,
          articleId: article.id,
          rank: index + 1,
          userId
        },
      })
    );

    await prisma.$transaction(updateOps);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors du reorderClassement :", error);
    return { success: false, message: 'Erreur serveur' };
  }
}