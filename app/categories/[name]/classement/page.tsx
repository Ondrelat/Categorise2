import ClientClassement from './ClientClassement';
import { Classement } from '@/app/types';
import { getSession } from 'next-auth/react'; // Exemple : si vous utilisez NextAuth.js pour l'authentification
import { getclassementsSortedByRating, fetchUserRankingsFromDB, likeArticle } from '@/app/lib/articles';


export default async function ClassementPage({
  params
}: {
  params: { name: string } // Typage direct des params
}) {
  const categoryName = params.name || 'Action';
  const ratingSource = 'categorise';
  const classement = await getclassementsSortedByRating(categoryName, ratingSource);
  console.log("classement", classement);
    console.log("categoryName :::" + params.name + categoryName);
    const session = await getSession();
    const userId = session?.user?.id;

const getUserRanking = async (): Promise<Classement[]> => {


  if (!userId) {
    console.log("[Server] User not authenticated, not fetching ranking.");
    return []; // Retourne un tableau vide (type valide: Classement[])
  }

  console.log(`[Server] Fetching user ranking for user: ${session.user.id}`);
  
  // Logique réelle pour récupérer le classement depuis ta DB
  const rankings: Classement[] = await fetchUserRankingsFromDB(userId);

  return rankings;
};

const handleLike = async (articleId: string, liked: boolean) => {
  'use server';
  console.log(`[Server Action] Article ${articleId} ${liked ? 'liké' : 'unliké'}`);
  
  if (userId) {
    return await likeArticle(articleId, liked, userId);
  }
  
  // Return a default response when user is not authenticated
  return { success: false };
};

  // Action pour noter
  const handleRateSlider = async (classementId: string, rating: number) => {
    'use server';
    // const session = await getSession();
    // if (!session?.user?.id) { throw new Error('Unauthorized'); }

    console.log(`[Server Action] classement ${classementId} noté ${rating}/100`);
    // Mettez à jour votre base de données ici
    return { success: true };
  };

  // Action pour ajouter un classement au classement utilisateur
  const handleAddclassementToUserRanking = async (classement: Classement) => {
    'use server';
    // const session = await getSession();
    // if (!session?.user?.id) { throw new Error('Unauthorized'); }

    console.log(`[Server Action] Ajout du classement ${classement.id} au classement utilisateur.`);
    // Logique d'ajout à la base de données de l'utilisateur
    // revalidatePath('/classements'); // Si l'ajout doit impacter la liste des classements affichée
    return { success: true };
  };

  // Action pour supprimer un classement du classement utilisateur
  const handleRemoveclassementFromUserRanking = async (classementId: string) => {
    'use server';
    // const session = await getSession();
    // if (!session?.user?.id) { throw new Error('Unauthorized'); }

    console.log(`[Server Action] Retrait du classement ${classementId} du classement utilisateur.`);
    // Logique de suppression de la base de données de l'utilisateur
    // revalidatePath('/classements');
    return { success: true };
  };

  // Action pour réordonner le classement utilisateur
  const handleReorderUserRanking = async (classementIds: string[]) => {
    'use server';
    // const session = await getSession();
    // if (!session?.user?.id) { throw new Error('Unauthorized'); }

    console.log(`[Server Action] Réordonnancement du classement utilisateur: ${classementIds}`);
    // Logique de mise à jour de l'ordre dans la base de données de l'utilisateur
    return { success: true };
  };

  const initialUserRanking = await getUserRanking();
  const isAuthenticated = !!(await getSession());

  return (
    <ClientClassement
      initialClassement={classement}
      categoryName={categoryName}
      initialRatingSource={ratingSource}
      isAuthenticated={isAuthenticated}
      initialUserRanking={initialUserRanking}
      // Passe les Server Actions au composant client via les props
      onLike={handleLike}
      onRateSlider={handleRateSlider}
      onAddclassementToUserRanking={handleAddclassementToUserRanking}
      onRemoveclassementFromUserRanking={handleRemoveclassementFromUserRanking}
      onReorderUserRanking={handleReorderUserRanking}
    />
  );
}