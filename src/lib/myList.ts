import prisma from './db/db';

export async function getCategoryId(categoryName?: string): Promise<string | undefined> {
  if (!categoryName) return undefined;

  try {
    const category = await prisma.categories.findFirst({
      where: { name: categoryName, isActive: true }
    });
    return category?.id;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return undefined;
  }
}

// Récupère la UserList pour un user + catégorie, ou undefined si introuvable
async function getUserListId(userId: string, categoryId?: string): Promise<string | undefined> {
  if (!categoryId) return undefined;
  const list = await prisma.userList.findFirst({
    where: { userId, categoryId },
  });
  return list?.id;
}

export async function fetchMyList(userId: string, categoryName?: string) {
  try {
    const categoryId = await getCategoryId(categoryName);
    if (!categoryId) return [];

    const listId = await getUserListId(userId, categoryId);
    if (!listId) return [];

    const userRankings = await prisma.articleClassementUserList.findMany({
      where: {
        listId
      },
      orderBy: [
        { rank: { sort: 'asc', nulls: 'last' } },
        { createdAt: 'desc' }
      ],
      include: {
        article: true,
        list: {
          include: {
            category: true,
          }
        }
      }
    });

    return userRankings.map((userRanking) => ({
      ...userRanking.article,
      rank: userRanking.rank,
      categoryName: userRanking.list?.category?.name || null,
      rankCategorise: null as number | null,
      scoreCategorise: null as number | null,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste:', error);
    throw new Error('Impossible de récupérer la liste des articles');
  }
}

// Fonction pour récupérer ou créer la UserList correspondant au user + catégorie
async function getOrCreateUserList(userId: string, categoryName?: string) {
  const categoryId = await getCategoryId(categoryName);
  if (!categoryId) throw new Error("Catégorie inconnue");

  let list = await prisma.userList.findFirst({
    where: { userId, categoryId }
  });

  if (!list) {
    list = await prisma.userList.create({
      data: {
        userId,
        categoryId,
        name: categoryName || 'Default',
      },
    });
  }

  return list;
}

export async function AddOrRemoveToMyList(articleId: string, onList: boolean, userId: string, categoryName?: string) {
  try {
    const list = await getOrCreateUserList(userId, categoryName);

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

export async function ReOrderMyList(ranking: { id: string }[], userId: string, categoryName?: string) {
  if (!userId) throw new Error("User ID manquant");
  if (!ranking || ranking.length === 0) return { success: false, message: 'Classement vide' };
  console.log("categoryName", categoryName)

  try {
    const list = await getOrCreateUserList(userId, categoryName);
    
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