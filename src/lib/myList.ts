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

export async function fetchMyList(userId: string, categorySlug?: string) {
  try {
    // Requête raw optimisée pour éviter les includes multiples
    const query = `
      SELECT 
        acul.id,
        acul."articleId",
        acul.rank,
        acul."createdAt",
        ac.id as "article_id",
        ac.tconst,
        ac."averageRatingIMDB",
        ac."numVotesIMDB",
        ac.titre_fr,
        ac.titre_en,
        ac.image_url,
        ac."createdAt" as "article_createdAt",
        ac.duration,
        ac."endYear",
        ac.genres,
        ac."startYear",
        ac."titleType",
        c.name as "categorySlug"
      FROM "ArticleClassementUserList" acul
      INNER JOIN "UserList" ul ON acul."listId" = ul.id
      INNER JOIN "Categories" c ON ul."categoryId" = c.id
      INNER JOIN "article_classement" ac ON acul."articleId" = ac.id
      WHERE 
        acul."userId" = $1
        AND ul."userId" = $1
        AND c.name = $2
        AND c."isActive" = true
      ORDER BY acul.rank ASC NULLS LAST, acul."createdAt" DESC
    `;

    interface RawQueryResult {
      id: string;
      articleId: string;
      rank: number | null;
      createdAt: Date;
      article_id: string;
      tconst: string;
      averageRatingIMDB: number | null;
      numVotesIMDB: number | null;
      titre_fr: string | null;
      titre_en: string | null;
      image_url: string | null;
      article_createdAt: Date;
      duration: number | null;
      endYear: number | null;
      genres: string | null;
      startYear: number | null;
      titleType: string | null;
      categorySlug: string;
    }

    const rawResults = await prisma.$queryRawUnsafe<RawQueryResult[]>(query, userId, categorySlug);

    return rawResults.map((row) => ({
      id: row.article_id,
      tconst: row.tconst,
      averageRatingIMDB: row.averageRatingIMDB,
      numVotesIMDB: row.numVotesIMDB,
      titre_fr: row.titre_fr,
      titre_en: row.titre_en,
      image_url: row.image_url,
      createdAt: row.article_createdAt,
      duration: row.duration,
      endYear: row.endYear,
      genres: row.genres,
      startYear: row.startYear,
      titleType: row.titleType,
      rank: row.rank,
      categorySlug: row.categorySlug,
      rankCategorise: null as number | null,
      scoreCategorise: null as number | null,
    }));
  } catch (error: Error | unknown) {
    console.error('Erreur lors de la récupération de la liste:', error);
    throw new Error('Impossible de récupérer la liste des articles');
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